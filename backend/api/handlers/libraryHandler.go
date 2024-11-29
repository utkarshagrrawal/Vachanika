package handlers

import (
	"encoding/json"
	"library/api/services"
	"library/models"
	"net/http"
	"strconv"

	"github.com/gorilla/mux"
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
	books, booksResponse := services.GetBooksService(pageNumber, values.Get("search"))
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

func GetBookDetails(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	values := mux.Vars(r)
	isbn := values["isbn"]
	if isbn == "" {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode("ISBN cannot be empty")
		return
	}
	bookDetails, bookDetailsResponse := services.GetBookDetailsService(isbn)
	if bookDetailsResponse != "" {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(bookDetailsResponse)
		return
	}
	json.NewEncoder(w).Encode(bookDetails)
}

func CheckoutBook(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	var borrowBookDetails models.BorrowBookRequest
	if err := json.NewDecoder(r.Body).Decode(&borrowBookDetails); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode("Error getting the book details")
		return
	}
	if borrowBookDetails.ISBN == "" {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode("ISBN cannot be empty")
		return
	}
	email, ok := r.Context().Value(models.UserToken("token")).(string)
	if !ok {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode("Error getting the user details")
		return
	}
	borrowBookResponse := services.CheckoutBookService(&borrowBookDetails, email)
	if borrowBookResponse != "Book checked out successfully" {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(borrowBookResponse)
		return
	}
	json.NewEncoder(w).Encode(borrowBookResponse)
}

func ReturnBook(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	var returnBookDetails models.ReturnBookRequest
	if err := json.NewDecoder(r.Body).Decode(&returnBookDetails); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode("Error getting the book details")
		return
	}
	if returnBookDetails.ISBN == "" {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode("ISBN cannot be empty")
		return
	}
	email, ok := r.Context().Value(models.UserToken("token")).(string)
	if !ok {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode("Error getting the user details")
		return
	}
	returnBookResponse := services.ReturnBookService(&returnBookDetails, email)
	if returnBookResponse != "Book returned successfully" {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(returnBookResponse)
		return
	}
	json.NewEncoder(w).Encode(returnBookResponse)
}

func GetBorrowHistory(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	email, ok := r.Context().Value(models.UserToken("token")).(string)
	if !ok {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode("Error getting the user details")
		return
	}
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
	borrowHistory, borrowHistoryResponse := services.GetBorrowedBooksHistoryService(email, pageNumber)
	if borrowHistoryResponse != "" {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(borrowHistoryResponse)
		return
	}
	json.NewEncoder(w).Encode(borrowHistory)
}
