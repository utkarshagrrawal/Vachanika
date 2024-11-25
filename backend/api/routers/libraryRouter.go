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
	router.Handle("/get-books", middlewares.VerifyToken(http.HandlerFunc(handlers.GetBooks))).Methods("GET", "OPTIONS")
	router.Handle("/get-library-summary", middlewares.VerifyToken(http.HandlerFunc(handlers.GetLibrarySummary))).Methods("GET", "OPTIONS")

	return router
}
