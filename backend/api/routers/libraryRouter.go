package routers

import (
	"library/api/handlers"
	"library/api/middlewares"

	"github.com/gorilla/mux"
)

func LibraryRouter() *mux.Router {
	router := mux.NewRouter()

	router.Use(middlewares.VerifyToken)

	router.HandleFunc("/add-book", handlers.AddBook).Methods("POST", "OPTIONS")
	router.HandleFunc("/books", handlers.GetBooks).Methods("GET", "OPTIONS")
	router.HandleFunc("/library-summary", handlers.GetLibrarySummary).Methods("GET", "OPTIONS")
	router.HandleFunc("/book/{isbn}", handlers.GetBookDetails).Methods("GET", "OPTIONS")
	router.HandleFunc("/checkout-book", handlers.CheckoutBook).Methods("POST", "OPTIONS")
	router.HandleFunc("/return-book", handlers.ReturnBook).Methods("POST", "OPTIONS")
	router.HandleFunc("/past-borrows", handlers.GetBorrowHistory).Methods("GET", "OPTIONS")
	router.HandleFunc("/extend-due-date", handlers.ExtendBookReturnDate).Methods("POST", "OPTIONS")
	router.HandleFunc("/lost-book", handlers.ReportBookLost).Methods("POST", "OPTIONS")
	router.HandleFunc("/add-to-wishlist", handlers.AddBookToWishlist).Methods("POST", "OPTIONS")
	router.HandleFunc("/reviews/{isbn}", handlers.GetBookReviews).Methods("GET", "OPTIONS")
	router.HandleFunc("/wishlist", handlers.GetUserWishlist).Methods("GET", "OPTIONS")
	router.HandleFunc("/remove-from-wishlist", handlers.RemoveBookFromWishlist).Methods("POST", "OPTIONS")
	router.HandleFunc("/activity", handlers.GetRecentLibraryActivity).Methods("GET", "OPTIONS")

	return router
}
