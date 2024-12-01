package routers

import (
	"library/api/handlers"
	"library/api/middlewares"
	"net/http"

	"github.com/gorilla/mux"
)

func LibraryRouter() *mux.Router {
	router := mux.NewRouter()

	router.Handle("/add-book", middlewares.VerifyToken(http.HandlerFunc(handlers.AddBook))).Methods("POST", "OPTIONS")
	router.Handle("/books", middlewares.VerifyToken(http.HandlerFunc(handlers.GetBooks))).Methods("GET", "OPTIONS")
	router.Handle("/library-summary", middlewares.VerifyToken(http.HandlerFunc(handlers.GetLibrarySummary))).Methods("GET", "OPTIONS")
	router.Handle("/book/{isbn}", middlewares.VerifyToken(http.HandlerFunc(handlers.GetBookDetails))).Methods("GET", "OPTIONS")
	router.Handle("/checkout-book", middlewares.VerifyToken(http.HandlerFunc(handlers.CheckoutBook))).Methods("POST", "OPTIONS")
	router.Handle("/return-book", middlewares.VerifyToken(http.HandlerFunc(handlers.ReturnBook))).Methods("POST", "OPTIONS")
	router.Handle("/past-borrows", middlewares.VerifyToken(http.HandlerFunc(handlers.GetBorrowHistory))).Methods("GET", "OPTIONS")
	router.Handle("/extend-due-date", middlewares.VerifyToken(http.HandlerFunc(handlers.ExtendBookReturnDate))).Methods("POST", "OPTIONS")
	router.Handle("/lost-book", middlewares.VerifyToken(http.HandlerFunc(handlers.ReportBookLost))).Methods("POST", "OPTIONS")
	router.Handle("/add-to-wishlist", middlewares.VerifyToken(http.HandlerFunc(handlers.AddBookToWishlist))).Methods("POST", "OPTIONS")
	router.Handle("/reviews/{isbn}", middlewares.VerifyToken(http.HandlerFunc(handlers.GetBookReviews))).Methods("GET", "OPTIONS")
	router.Handle("/wishlist", middlewares.VerifyToken(http.HandlerFunc(handlers.GetUserWishlist))).Methods("GET", "OPTIONS")
	router.Handle("/remove-from-wishlist", middlewares.VerifyToken(http.HandlerFunc(handlers.RemoveBookFromWishlist))).Methods("POST", "OPTIONS")
	router.Handle("/activity", middlewares.VerifyToken(http.HandlerFunc(handlers.GetRecentLibraryActivity))).Methods("GET", "OPTIONS")

	return router
}
