package handlers

import (
	"encoding/json"
	"library/api/services"
	"library/models"
	"net/http"
	"strconv"
)

func AddBook(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	var requestedBookDetails models.AddBookRequest
	if err := json.NewDecoder(r.Body).Decode(&requestedBookDetails); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode("Error getting the book details")
		return
	}
	if requestedBookDetails.Quantity == 0 {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode("Quantity cannot be empty")
		return
	}
	if requestedBookDetails.ISBN == "" {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode("ISBN cannot be empty")
		return
	}
	addBookResponse := services.AddBookService(&requestedBookDetails)
	if addBookResponse != "Book added successfully" && addBookResponse != "Book quantity updated successfully" {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(addBookResponse)
		return
	}
	json.NewEncoder(w).Encode(addBookResponse)
}

func GetBooks(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	values := r.URL.Query()
	page := values.Get("page")
	if page == "" {
		page = "1"
	}
	pageNumber, err := strconv.Atoi(page)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode("Invalid page number")
		return
	}
	books, booksResponse := services.GetBooksService(pageNumber)
	if booksResponse != "" {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(booksResponse)
		return
	}
	json.NewEncoder(w).Encode(books)
}

func GetLibrarySummary(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	librarySummary, librarySummaryResponse := services.GetLibrarySummaryService()
	if librarySummaryResponse != "" {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(librarySummaryResponse)
		return
	}
	json.NewEncoder(w).Encode(librarySummary)
}
