package services

import (
	"database/sql"
	"encoding/json"
	"io"
	"library/database"
	"library/models"
	"net/http"
	"strconv"
	"time"
)

func AddBookService(b *models.AddBookRequest) string {
	txn, err := database.DatabaseConnection.DB.Begin()
	if err != nil {
		return "An error occurred while accessing the database."
	}
	if _, err := database.DatabaseConnection.DB.Exec("CREATE TABLE IF NOT EXISTS BOOKS (ISBN NVARCHAR(15) PRIMARY KEY, TITLE NVARCHAR(200), AUTHOR NVARCHAR(250), PUBLISHER NVARCHAR(250), QUANTITY INT, CREATED_AT DATE, CHECKED_OUT INT, OVERDUE INT)"); err != nil {
		return "An error occurred while accessing the books table."
	}
	if _, err := database.DatabaseConnection.DB.Exec("CREATE TABLE IF NOT EXISTS BOOK_GENRES (BOOK_ISBN NVARCHAR(15), GENRE NVARCHAR(100), FOREIGN KEY (BOOK_ISBN) REFERENCES BOOKS(ISBN), PRIMARY KEY(BOOK_ISBN, GENRE))"); err != nil {
		return "Error creating or accessing the book genres table in the database"
	}
	row := txn.QueryRow("SELECT QUANTITY FROM BOOKS WHERE ISBN = ?", b.ISBN)
	var quantity int
	if err := row.Scan(&quantity); err == nil {
		if _, err = txn.Exec("UPDATE BOOKS SET QUANTITY = ?, CREATED_AT = ? WHERE ISBN = ?", quantity+b.Quantity, time.Now(), b.ISBN); err != nil {
			txn.Rollback()
			return "An error occurred while updating the book quantity. Please try again later."
		}
		if err = txn.Commit(); err != nil {
			return "An error occurred while updating the book quantity. Please try again later."
		}
		return "Book quantity updated successfully"
	} else if err != sql.ErrNoRows {
		txn.Rollback()
		return "An error occurred while looking for the book in database. Please try again later."
	}
	resp, err := http.Get("https://openlibrary.org/search.json?isbn=" + b.ISBN)
	if err != nil {
		return "Unable to retrieve book details. Please check the ISBN and try again."
	}
	defer resp.Body.Close()
	bodyBytes, err := io.ReadAll(resp.Body)
	if err != nil {
		return "Unable to read book details from the response."
	}
	var bookDetails models.OpenLibraryResponse
	err = json.Unmarshal(bodyBytes, &bookDetails)
	if err != nil {
		return "Unable to parse book details from the response."
	}
	if bookDetails.NumFound == 0 {
		return "No book found with the provided ISBN. Please verify the ISBN and try again."
	}
	if _, err = txn.Exec("INSERT INTO BOOKS VALUES (?, ?, ?, ?, ?, ?, ?, ?)", b.ISBN, bookDetails.Docs[0].Title, bookDetails.Docs[0].AuthorName[0], bookDetails.Docs[0].Publisher[0], b.Quantity, time.Now(), 0, 0); err != nil {
		return "An error occurred while adding the book to the database. Please try again later."
	}
	for _, genre := range bookDetails.Docs[0].Subject {
		if _, err = txn.Exec("INSERT INTO BOOK_GENRES VALUES (?, ?)", b.ISBN, genre); err != nil {
			txn.Rollback()
			return "An error occurred while adding the book genres to the database. Please try again later."
		}
	}
	if err = txn.Commit(); err != nil {
		return "An error occurred while saving the book. Please try again later."
	}
	return "Book added successfully"
}

func GetBooksService(page int) ([]models.Books, string) {
	var books []models.Books
	skip := (page - 1) * 20
	query := "SELECT b.ISBN, b.TITLE, b.AUTHOR, b.PUBLISHER, b.QUANTITY, GROUP_CONCAT(bg.GENRE SEPARATOR ', ') FROM BOOKS b LEFT JOIN BOOK_GENRES bg ON b.ISBN = bg.BOOK_ISBN GROUP BY b.ISBN, b.TITLE, b.AUTHOR, b.PUBLISHER, b.QUANTITY ORDER BY b.ISBN LIMIT " + strconv.Itoa(20) + " OFFSET " + strconv.Itoa(skip)
	rows, err := database.DatabaseConnection.DB.Query(query)
	if err != nil {
		return books, "An error occurred while accessing the database."
	}
	defer rows.Close()
	for rows.Next() {
		var book models.Books
		if err := rows.Scan(&book.ISBN, &book.Title, &book.Author, &book.Publisher, &book.Quantity, &book.Genre); err != nil {
			return books, "An error occurred while reading the book details."
		}
		books = append(books, book)
	}
	return books, ""
}

func GetLibrarySummaryService() (models.LibrarySummary, string) {
	var summary models.LibrarySummary
	query := "SELECT SUM(QUANTITY), SUM(CHECKED_OUT), SUM(OVERDUE) FROM BOOKS WHERE MONTH(CURRENT_DATE()) = MONTH(CREATED_AT) AND YEAR(CURRENT_DATE()) = YEAR(CREATED_AT)"
	row := database.DatabaseConnection.DB.QueryRow(query)
	if err := row.Scan(&summary.BooksAddedThisMonth, &summary.BooksCheckedOutThisMonth, &summary.BooksOverdueThisMonth); err != nil {
		return summary, "An error occurred while reading the book count."
	}
	query = "SELECT SUM(QUANTITY), SUM(CHECKED_OUT), SUM(OVERDUE) FROM BOOKS"
	row = database.DatabaseConnection.DB.QueryRow(query)
	if err := row.Scan(&summary.TotalBooks, &summary.TotalCheckedOut, &summary.TotalOverdue); err != nil {
		return summary, "An error occurred while reading the book count."
	}
	return summary, ""
}
