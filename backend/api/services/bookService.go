package services

import (
	"io"
	"library/database"
	"library/models"
	"net/http"
)

func AddBookService(b *models.Books) string {
	_, err := database.DatabaseConnection.DB.Exec("CREATE TABLE IF NOT EXISTS BOOKS (ISBN NVARCHAR(15) PRIMARY KEY, TITLE NVARCHAR(200), AUTHOR NVARCHAR(250), PUBLISHER NVARCHAR(250), GENRE NVARCHAR(25), QUANTITY INT)")
	if err != nil {
		return "Error finding the books table"
	}
	resp, err := http.Get("https://openlibrary.org/search.json?isbn=" + b.ISBN)
	if err != nil {
		return "Error getting book details by ISBN"
	}
	defer resp.Body.Close()
	bodyBytes, err := io.ReadAll(resp.Body)
	if err != nil {
		return "Error reading the details of book"
	}
	_, err = database.DatabaseConnection.DB.Exec("INSERT INTO TABLE BOOKS VALUES (?, ?, ?, ?, ?, ?)", b.ISBN, b.Title, b.Author, b.Publisher, b.Genre, b.Quantity)
	if err != nil {
		return "Error while creating the record for book"
	}
	return "Book added successfully"
}
