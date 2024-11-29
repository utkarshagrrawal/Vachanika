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
	for _, genre := range b.Genres {
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

func GetBooksService(page int, searchText string) ([]models.Books, string) {
	var books []models.Books
	var query string
	skip := (page - 1) * 20
	if _, err := database.DatabaseConnection.DB.Exec("CREATE TABLE IF NOT EXISTS BOOKS (ISBN NVARCHAR(15) PRIMARY KEY, TITLE NVARCHAR(200), AUTHOR NVARCHAR(250), PUBLISHER NVARCHAR(250), QUANTITY INT, CREATED_AT DATE, CHECKED_OUT INT, OVERDUE INT)"); err != nil {
		return books, "An error occurred while accessing the books table."
	}
	if _, err := database.DatabaseConnection.DB.Exec("CREATE TABLE IF NOT EXISTS BOOK_GENRES (BOOK_ISBN NVARCHAR(15), GENRE NVARCHAR(100), FOREIGN KEY (BOOK_ISBN) REFERENCES BOOKS(ISBN), PRIMARY KEY(BOOK_ISBN, GENRE))"); err != nil {
		return books, "Error creating or accessing the book genres table in the database"
	}
	if _, err := database.DatabaseConnection.DB.Exec("CREATE TABLE IF NOT EXISTS BOOK_REVIEWS (REVIEW_ID INT PRIMARY KEY AUTO_INCREMENT, BOOK_ISBN NVARCHAR(15), USER_EMAIL NVARCHAR(250), REVIEW NVARCHAR(500), RATING INT)"); err != nil {
		return books, "An error occurred while accessing the book reviews table."
	}
	if searchText == "" {
		query = "SELECT b.ISBN, b.TITLE, b.AUTHOR, b.PUBLISHER, b.QUANTITY, GROUP_CONCAT(bg.GENRE SEPARATOR ', '), COALESCE(SUM(br.RATING) / COUNT(br.BOOK_ISBN), 0) FROM BOOKS b LEFT JOIN BOOK_GENRES bg ON b.ISBN = bg.BOOK_ISBN LEFT JOIN BOOK_REVIEWS br ON br.BOOK_ISBN = b.ISBN GROUP BY b.ISBN, b.TITLE, b.AUTHOR, b.PUBLISHER, b.QUANTITY ORDER BY b.ISBN LIMIT " + strconv.Itoa(20) + " OFFSET " + strconv.Itoa(skip)
	} else {
		query = "SELECT b.ISBN, b.TITLE, b.AUTHOR, b.PUBLISHER, b.QUANTITY, GROUP_CONCAT(bg.GENRE SEPARATOR ', '), COALESCE(SUM(br.RATING) / COUNT(br.BOOK_ISBN), 0) FROM BOOKS b LEFT JOIN BOOK_GENRES bg ON b.ISBN = bg.BOOK_ISBN LEFT JOIN BOOK_REVIEWS br ON br.BOOK_ISBN = b.ISBN WHERE b.TITLE LIKE '%" + searchText + "%' GROUP BY b.ISBN, b.TITLE, b.AUTHOR, b.PUBLISHER, b.QUANTITY ORDER BY b.ISBN LIMIT " + strconv.Itoa(20) + " OFFSET " + strconv.Itoa(skip)
	}
	rows, err := database.DatabaseConnection.DB.Query(query)
	if err != nil {
		return books, "An error occurred while accessing the database."
	}
	defer rows.Close()
	for rows.Next() {
		var book models.Books
		if err := rows.Scan(&book.ISBN, &book.Title, &book.Author, &book.Publisher, &book.Quantity, &book.Genre, &book.Rating); err != nil {
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

func GetBookDetailsService(isbn string) (models.Books, string) {
	var book models.Books
	if _, err := database.DatabaseConnection.DB.Exec("CREATE TABLE IF NOT EXISTS BOOKS (ISBN NVARCHAR(15) PRIMARY KEY, TITLE NVARCHAR(200), AUTHOR NVARCHAR(250), PUBLISHER NVARCHAR(250), QUANTITY INT, CREATED_AT DATE, CHECKED_OUT INT, OVERDUE INT)"); err != nil {
		return book, "An error occurred while accessing the books table."
	}
	if _, err := database.DatabaseConnection.DB.Exec("CREATE TABLE IF NOT EXISTS BOOK_GENRES (BOOK_ISBN NVARCHAR(15), GENRE NVARCHAR(100), FOREIGN KEY (BOOK_ISBN) REFERENCES BOOKS(ISBN), PRIMARY KEY(BOOK_ISBN, GENRE))"); err != nil {
		return book, "Error creating or accessing the book genres table in the database"
	}
	if _, err := database.DatabaseConnection.DB.Exec("CREATE TABLE IF NOT EXISTS BOOK_REVIEWS (REVIEW_ID INT PRIMARY KEY AUTO_INCREMENT, BOOK_ISBN NVARCHAR(15), USER_EMAIL NVARCHAR(250), REVIEW NVARCHAR(500), RATING INT)"); err != nil {
		return book, "An error occurred while accessing the book reviews table."
	}
	query := "SELECT b.ISBN, b.TITLE, b.AUTHOR, b.PUBLISHER, b.QUANTITY, GROUP_CONCAT(bg.GENRE SEPARATOR ', '), COALESCE(SUM(br.RATING) / COUNT(br.BOOK_ISBN), 0) FROM BOOKS b LEFT JOIN BOOK_GENRES bg ON b.ISBN = bg.BOOK_ISBN LEFT JOIN BOOK_REVIEWS br on br.BOOK_ISBN = b.ISBN WHERE b.ISBN = ? GROUP BY b.ISBN, b.TITLE, b.AUTHOR, b.PUBLISHER, b.QUANTITY"
	row := database.DatabaseConnection.DB.QueryRow(query, isbn)
	if err := row.Scan(&book.ISBN, &book.Title, &book.Author, &book.Publisher, &book.Quantity, &book.Genre, &book.Rating); err != nil {
		return book, "An error occurred while reading the book details."
	}
	return book, ""
}

func CheckoutBookService(b *models.BorrowBookRequest, userEmail string) string {
	if _, err := database.DatabaseConnection.DB.Exec("CREATE TABLE IF NOT EXISTS BORROW_HISTORY (USER_EMAIL NVARCHAR(250), BOOK_ISBN NVARCHAR(15), CHECKOUT_DATE DATE, RETURN_DATE DATE, RETURNED BOOLEAN, OVERDUE BOOLEAN, LOST BOOLEAN PRIMARY KEY(USER_EMAIL, BOOK_ISBN, CHECKOUT_DATE, RETURN_DATE))"); err != nil {
		return "An error occurred while accessing the borrow history table."
	}
	if _, err := database.DatabaseConnection.DB.Exec("CREATE TABLE IF NOT EXISTS ACTIVITY_LOGS (USER_EMAIL NVARCHAR(250), ACTIVITY NVARCHAR(500), TIMESTAMP DATETIME)"); err != nil {
		return "An error occurred while accessing the activity logs table."
	}
	txn, err := database.DatabaseConnection.DB.Begin()
	if err != nil {
		return "An error occurred while accessing the database."
	}
	row := txn.QueryRow("SELECT QUANTITY, CHECKED_OUT FROM BOOKS WHERE ISBN = ?", b.ISBN)
	var quantity, checkedOut int
	if err := row.Scan(&quantity, &checkedOut); err != nil {
		return "An error occurred while looking for the book in database. Please try again later."
	}
	if quantity == checkedOut {
		return "The book is currently not available."
	}
	var thisBookCheckedOutOrNot int
	row = txn.QueryRow("SELECT COUNT(*) FROM BORROW_HISTORY WHERE USER_EMAIL = ? AND BOOK_ISBN = ? AND RETURNED = ? AND LOST = ?", userEmail, b.ISBN, false, false)
	if err := row.Scan(&thisBookCheckedOutOrNot); err != nil {
		txn.Rollback()
		return "An error occurred while checking if the book is already checked out. Please try again later."
	}
	if thisBookCheckedOutOrNot > 0 {
		txn.Rollback()
		return "The book is already checked out by you."
	}
	var totalCheckedOut int
	row = txn.QueryRow("SELECT COUNT(*) FROM BORROW_HISTORY WHERE USER_EMAIL = ? AND RETURNED = ? AND LOST = ?", userEmail, false, false)
	if err := row.Scan(&totalCheckedOut); err != nil {
		txn.Rollback()
		return "An error occurred while checking the number of books checked out. Please try again later."
	}
	if totalCheckedOut >= 5 {
		txn.Rollback()
		return "You have already checked out 5 books. Please return a book to check out another."
	}
	if _, err = txn.Exec("UPDATE BOOKS SET CHECKED_OUT = ? WHERE ISBN = ?", checkedOut+1, b.ISBN); err != nil {
		txn.Rollback()
		return "An error occurred while checking out the book. Please try again later."
	}
	if _, err = txn.Exec("INSERT INTO BORROW_HISTORY VALUES (?, ?, ?, ?, ?, ?, ?)", userEmail, b.ISBN, time.Now(), time.Now().Add(7*24*60*time.Minute), false, false, false); err != nil {
		txn.Rollback()
		return "An error occurred while checking out the book. Please try again later."
	}
	if _, err = txn.Exec("INSERT INTO ACTIVITY_LOGS VALUES (?, ?, ?)", userEmail, "Checked out the book with ISBN "+b.ISBN, time.Now()); err != nil {
		txn.Rollback()
		return "An error occurred while logging the activity. Please try again later."
	}
	if err = txn.Commit(); err != nil {
		return "An error occurred while checking out the book. Please try again later."
	}
	return "Book checked out successfully"
}

func ReturnBookService(b *models.BookManagementRequest) string {
	if _, err := database.DatabaseConnection.DB.Exec("CREATE TABLE IF NOT EXISTS BORROW_HISTORY (USER_EMAIL NVARCHAR(250), BOOK_ISBN NVARCHAR(15), CHECKOUT_DATE DATE, RETURN_DATE DATE, RETURNED BOOLEAN, OVERDUE BOOLEAN, LOST BOOLEAN, PRIMARY KEY(USER_EMAIL, BOOK_ISBN, CHECKOUT_DATE, RETURN_DATE))"); err != nil {
		return "An error occurred while accessing the borrow history table."
	}
	if _, err := database.DatabaseConnection.DB.Exec("CREATE TABLE IF NOT EXISTS ACTIVITY_LOGS (USER_EMAIL NVARCHAR(250), ACTIVITY NVARCHAR(500), TIMESTAMP DATETIME)"); err != nil {
		return "An error occurred while accessing the activity logs table."
	}
	if _, err := database.DatabaseConnection.DB.Exec("CREATE TABLE IF NOT EXISTS BOOK_REVIEWS (REVIEW_ID INT PRIMARY KEY AUTO_INCREMENT, BOOK_ISBN NVARCHAR(15), USER_EMAIL NVARCHAR(250), REVIEW NVARCHAR(500), RATING INT)"); err != nil {
		return "An error occurred while accessing the book reviews table."
	}
	txn, err := database.DatabaseConnection.DB.Begin()
	if err != nil {
		return "An error occurred while accessing the database."
	}
	var checkedOut int
	row := txn.QueryRow("SELECT CHECKED_OUT FROM BOOKS WHERE ISBN = ?", b.ISBN)
	if err := row.Scan(&checkedOut); err != nil {
		txn.Rollback()
		return "An error occurred while checking for the book in the database. Please try again later."
	}
	if checkedOut == 0 {
		txn.Rollback()
		return "The book is currently not checked out."
	}
	row = txn.QueryRow("SELECT COUNT(*) FROM BORROW_HISTORY WHERE USER_EMAIL = ? AND BOOK_ISBN = ? AND RETURNED = ? AND LOST = ?", b.Email, b.ISBN, false, false)
	var bookCheckedOut int
	if err := row.Scan(&bookCheckedOut); err != nil {
		txn.Rollback()
		return "An error occurred while checking if the book is checked out. Please try again later."
	}
	if bookCheckedOut == 0 {
		txn.Rollback()
		return "The book is not checked out by you."
	}
	if _, err := txn.Exec("UPDATE BOOKS SET CHECKED_OUT = ? WHERE ISBN = ?", checkedOut-1, b.ISBN); err != nil {
		txn.Rollback()
		return "An error occurred while returning the book. Please try again later."
	}
	if _, err := txn.Exec("UPDATE BORROW_HISTORY SET RETURNED = ?, RETURN_DATE = ? WHERE USER_EMAIL = ? AND BOOK_ISBN = ? AND RETURNED = ?", true, time.Now(), b.Email, b.ISBN, false); err != nil {
		txn.Rollback()
		return "An error occurred while returning the book. Please try again later."
	}
	if _, err := txn.Exec("INSERT INTO ACTIVITY_LOGS VALUES (?, ?, ?)", b.Email, "Returned the book with ISBN "+b.ISBN, time.Now()); err != nil {
		txn.Rollback()
		return "An error occurred while logging the activity. Please try again later."
	}
	if b.Review != "" {
		if _, err := txn.Exec("INSERT INTO BOOK_REVIEWS (BOOK_ISBN, USER_EMAIL, REVIEW, RATING) VALUES (?, ?, ?, ?)", b.ISBN, b.Email, b.Review, b.Rating); err != nil {
			txn.Rollback()
			return "An error occurred while adding the review to the database. Please try again later."
		}
	}
	if err = txn.Commit(); err != nil {
		return "An error occurred while returning the book. Please try again later."
	}
	return "Book returned successfully"
}

func GetBorrowedBooksHistoryService(email string, page int) ([]models.BorrowedBook, string) {
	skip := (page - 1) * 20
	var books []models.BorrowedBook
	if _, err := database.DatabaseConnection.DB.Exec("CREATE TABLE IF NOT EXISTS BORROW_HISTORY (USER_EMAIL NVARCHAR(250), BOOK_ISBN NVARCHAR(15), CHECKOUT_DATE DATE, RETURN_DATE DATE, RETURNED BOOLEAN, OVERDUE BOOLEAN, LOST BOOLEAN, PRIMARY KEY(USER_EMAIL, BOOK_ISBN, CHECKOUT_DATE, RETURN_DATE))"); err != nil {
		return books, "An error occurred while accessing the borrow history table."
	}
	rows, err := database.DatabaseConnection.DB.Query("SELECT b.ISBN, b.TITLE, b.AUTHOR, bh.CHECKOUT_DATE, bh.RETURN_DATE, bh.LOST FROM BOOKS b INNER JOIN BORROW_HISTORY bh ON b.ISBN = bh.BOOK_ISBN WHERE bh.USER_EMAIL = ? AND (bh.RETURNED = ? OR bh.LOST = ?) ORDER BY bh.CHECKOUT_DATE DESC LIMIT 20 OFFSET ?", email, true, true, skip)
	if err != nil {
		return books, "An error occurred while accessing the database."
	}
	for rows.Next() {
		var book models.BorrowedBook
		if err := rows.Scan(&book.ISBN, &book.Title, &book.Author, &book.CheckoutDate, &book.ReturnDate, &book.Lost); err != nil {
			return books, "An error occurred while reading the book details."
		}
		books = append(books, book)
	}
	return books, ""
}

func ExtendBookReturnDateService(b *models.BookManagementRequest) string {
	if _, err := database.DatabaseConnection.DB.Exec("CREATE TABLE IF NOT EXISTS BORROW_HISTORY (USER_EMAIL NVARCHAR(250), BOOK_ISBN NVARCHAR(15), CHECKOUT_DATE DATE, RETURN_DATE DATE, RETURNED BOOLEAN, OVERDUE BOOLEAN, LOST BOOLEAN, PRIMARY KEY(USER_EMAIL, BOOK_ISBN, CHECKOUT_DATE, RETURN_DATE))"); err != nil {
		return "An error occurred while accessing the borrow history table."
	}
	if _, err := database.DatabaseConnection.DB.Exec("CREATE TABLE IF NOT EXISTS ACTIVITY_LOGS (USER_EMAIL NVARCHAR(250), ACTIVITY NVARCHAR(500), TIMESTAMP DATETIME)"); err != nil {
		return "An error occurred while accessing the activity logs table."
	}
	txn, err := database.DatabaseConnection.DB.Begin()
	if err != nil {
		return "An error occurred while accessing the database."
	}
	var returnDate time.Time
	if err := txn.QueryRow("SELECT RETURN_DATE FROM BORROW_HISTORY WHERE USER_EMAIL = ? AND BOOK_ISBN = ? AND RETURNED = ? AND LOST = ?", b.Email, b.ISBN, false, false).Scan(&returnDate); err == sql.ErrNoRows {
		txn.Rollback()
		return "The book is not checked out by you."
	} else if err != nil {
		txn.Rollback()
		return "An error occurred while checking the return date. Please try again later."
	}
	if _, err := txn.Exec("UPDATE BORROW_HISTORY SET RETURN_DATE = ? WHERE USER_EMAIL = ? AND BOOK_ISBN = ? AND RETURNED = ? AND LOST = ?", returnDate.Add(7*24*time.Hour), b.Email, b.ISBN, false, false); err != nil {
		txn.Rollback()
		return "An error occurred while extending the return date. Please try again later."
	}
	if _, err := txn.Exec("INSERT INTO ACTIVITY_LOGS VALUES (?, ?, ?)", b.Email, "Extended the return date for the book with ISBN "+b.ISBN, time.Now()); err != nil {
		txn.Rollback()
		return "An error occurred while logging the activity. Please try again later."
	}
	if err = txn.Commit(); err != nil {
		return "An error occurred while extending the return date. Please try again later."
	}
	return "Book return date extended successfully"
}

func ReportBookLostService(b *models.BookManagementRequest) string {
	if _, err := database.DatabaseConnection.DB.Exec("CREATE TABLE IF NOT EXISTS BORROW_HISTORY (USER_EMAIL NVARCHAR(250), BOOK_ISBN NVARCHAR(15), CHECKOUT_DATE DATE, RETURN_DATE DATE, RETURNED BOOLEAN, OVERDUE BOOLEAN, LOST BOOLEAN, PRIMARY KEY(USER_EMAIL, BOOK_ISBN, CHECKOUT_DATE, RETURN_DATE))"); err != nil {
		return "An error occurred while accessing the borrow history table."
	}
	if _, err := database.DatabaseConnection.DB.Exec("CREATE TABLE IF NOT EXISTS ACTIVITY_LOGS (USER_EMAIL NVARCHAR(250), ACTIVITY NVARCHAR(500), TIMESTAMP DATETIME)"); err != nil {
		return "An error occurred while accessing the activity logs table."
	}
	txn, err := database.DatabaseConnection.DB.Begin()
	if err != nil {
		return "An error occurred while accessing the database."
	}
	var isBookCheckedOut int
	if err := txn.QueryRow("SELECT COUNT(*) FROM BORROW_HISTORY WHERE USER_EMAIL = ? AND BOOK_ISBN = ? AND RETURNED = ? AND LOST = ?", b.Email, b.ISBN, false, false).Scan(&isBookCheckedOut); err != nil {
		txn.Rollback()
		return "An error occurred while checking if the book is checked out. Please try again later."
	}
	if isBookCheckedOut == 0 {
		txn.Rollback()
		return "The book is not checked out by you."
	}
	if _, err := txn.Exec("UPDATE BORROW_HISTORY SET LOST = ? WHERE USER_EMAIL = ? AND BOOK_ISBN = ? AND RETURNED = ? AND LOST = ?", true, b.Email, b.ISBN, false, false); err != nil {
		txn.Rollback()
		return "An error occurred while reporting the book as lost. Please try again later."
	}
	if _, err := txn.Exec("INSERT INTO ACTIVITY_LOGS VALUES (?, ?, ?)", b.Email, "Reported the book with ISBN "+b.ISBN+" as lost", time.Now()); err != nil {
		txn.Rollback()
		return "An error occurred while logging the activity. Please try again later."
	}
	if err = txn.Commit(); err != nil {
		return "An error occurred while reporting the book as lost. Please try again later."
	}
	return "Book reported as lost successfully, please pay the fine to the library."
}
