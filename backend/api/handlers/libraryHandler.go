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
	role, ok := r.Context().Value(models.SessionInfo("role")).(string)
	if !ok {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode("Error getting the user role")
		return
	}
	if role != "librarian" {
		w.WriteHeader(http.StatusForbidden)
		json.NewEncoder(w).Encode("You are not authorized to add books")
		return
	}
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
	role, ok := r.Context().Value(models.SessionInfo("role")).(string)
	if !ok {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode("Error getting the user role")
		return
	}
	if role != "librarian" {
		w.WriteHeader(http.StatusForbidden)
		json.NewEncoder(w).Encode("You are not authorized to view the library summary")
		return
	}
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
	email, ok := r.Context().Value(models.SessionInfo("email")).(string)
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
	var returnBookDetails models.BookManagementRequest
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
	email, ok := r.Context().Value(models.SessionInfo("email")).(string)
	if !ok {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode("Error getting the user details")
		return
	}
	returnBookDetails.Email = email
	returnBookResponse := services.ReturnBookService(&returnBookDetails)
	if returnBookResponse != "Book returned successfully" {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(returnBookResponse)
		return
	}
	json.NewEncoder(w).Encode(returnBookResponse)
}

func GetBorrowHistory(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	email, ok := r.Context().Value(models.SessionInfo("email")).(string)
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

func ExtendBookReturnDate(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	var extendReturnDateDetails models.BookManagementRequest
	if err := json.NewDecoder(r.Body).Decode(&extendReturnDateDetails); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode("Error getting the book details")
		return
	}
	if extendReturnDateDetails.ISBN == "" {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode("ISBN cannot be empty")
		return
	}
	email, ok := r.Context().Value(models.SessionInfo("email")).(string)
	if !ok {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode("Error getting the user details")
		return
	}
	extendReturnDateDetails.Email = email
	extendReturnDateResponse := services.ExtendBookReturnDateService(&extendReturnDateDetails)
	if extendReturnDateResponse != "Book return date extended successfully" {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(extendReturnDateResponse)
		return
	}
	json.NewEncoder(w).Encode(extendReturnDateResponse)
}

func ReportBookLost(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	var reportBookLostDetails models.BookManagementRequest
	if err := json.NewDecoder(r.Body).Decode(&reportBookLostDetails); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode("Error getting the book details")
		return
	}
	if reportBookLostDetails.ISBN == "" {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode("ISBN cannot be empty")
		return
	}
	email, ok := r.Context().Value(models.SessionInfo("email")).(string)
	if !ok {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode("Error getting the user details")
		return
	}
	reportBookLostDetails.Email = email
	reportBookLostResponse := services.ReportBookLostService(&reportBookLostDetails)
	if reportBookLostResponse != "Book reported as lost successfully, please pay the fine to the library." {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(reportBookLostResponse)
		return
	}
	json.NewEncoder(w).Encode(reportBookLostResponse)
}

func AddBookToWishlist(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	var addBookToWishlistDetails models.BookManagementRequest
	if err := json.NewDecoder(r.Body).Decode(&addBookToWishlistDetails); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode("Error getting the book details")
		return
	}
	if addBookToWishlistDetails.ISBN == "" {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode("ISBN cannot be empty")
		return
	}
	email, ok := r.Context().Value(models.SessionInfo("email")).(string)
	if !ok {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode("Error getting the user details")
		return
	}
	addBookToWishlistDetails.Email = email
	addBookToWishlistResponse := services.AddBookToWishlistService(&addBookToWishlistDetails)
	if addBookToWishlistResponse != "Book added to wishlist successfully" {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(addBookToWishlistResponse)
		return
	}
	json.NewEncoder(w).Encode(addBookToWishlistResponse)
}

func GetBookReviews(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	routeParams := mux.Vars(r)
	isbn := routeParams["isbn"]
	if isbn == "" {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode("ISBN cannot be empty")
		return
	}
	queryParams := r.URL.Query()
	page := queryParams.Get("page")
	if page == "" {
		page = "1"
	}
	pageNumber, err := strconv.Atoi(page)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode("Invalid page number")
		return
	}
	reviews, reviewsResponse := services.GetBookReviewsService(isbn, pageNumber)
	if reviewsResponse != "" {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(reviewsResponse)
		return
	}
	json.NewEncoder(w).Encode(reviews)
}

func GetUserWishlist(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	email, ok := r.Context().Value(models.SessionInfo("email")).(string)
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
	wishlist, wishlistResponse := services.GetUserWishlistService(email, pageNumber)
	if wishlistResponse != "" {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(wishlistResponse)
		return
	}
	json.NewEncoder(w).Encode(wishlist)
}

func RemoveBookFromWishlist(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	var removeBookFromWishlistDetails models.BookManagementRequest
	if err := json.NewDecoder(r.Body).Decode(&removeBookFromWishlistDetails); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode("Error getting the book details")
		return
	}
	if removeBookFromWishlistDetails.ISBN == "" {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode("ISBN cannot be empty")
		return
	}
	email, ok := r.Context().Value(models.SessionInfo("email")).(string)
	if !ok {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode("Error getting the user details")
		return
	}
	removeBookFromWishlistDetails.Email = email
	removeBookFromWishlistResponse := services.RemoveBookFromWishlistService(&removeBookFromWishlistDetails)
	if removeBookFromWishlistResponse != "Book removed from wishlist successfully" {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(removeBookFromWishlistResponse)
		return
	}
	json.NewEncoder(w).Encode(removeBookFromWishlistResponse)
}

func GetRecentLibraryActivity(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	role, ok := r.Context().Value(models.SessionInfo("role")).(string)
	if !ok {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode("Error getting the user role")
		return
	}
	if role != "librarian" {
		w.WriteHeader(http.StatusForbidden)
		json.NewEncoder(w).Encode("You are not authorized to view the library activity")
		return
	}
	queryParams := r.URL.Query()
	page := queryParams.Get("page")
	if page == "" {
		page = "1"
	}
	pageNumber, err := strconv.Atoi(page)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode("Invalid page number")
		return
	}
	activity, activityResponse := services.GetRecentLibraryActivityService(pageNumber)
	if activityResponse != "" {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(activityResponse)
		return
	}
	json.NewEncoder(w).Encode(activity)
}
