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

	return router
}
