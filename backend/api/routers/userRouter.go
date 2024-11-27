package routers

import (
	"library/api/handlers"
	"library/api/middlewares"
	"net/http"

	"github.com/gorilla/mux"
)

func UserRouter() *mux.Router {
	router := mux.NewRouter()

	router.Handle("/details", middlewares.VerifyToken(http.HandlerFunc(handlers.GetUserDetails))).Methods("GET", "OPTIONS")
	router.Handle("/details", middlewares.VerifyToken(http.HandlerFunc(handlers.UpdateUserDetails))).Methods("PUT", "OPTIONS")
	router.Handle("/delete", middlewares.VerifyToken(http.HandlerFunc(handlers.DeleteUser))).Methods("DELETE", "OPTIONS")
	router.HandleFunc("/delete-verification/{deletionToken}", handlers.VerifyDeleteAccount).Methods("GET", "OPTIONS")
	router.Handle("/borrowed-books", middlewares.VerifyToken(http.HandlerFunc(handlers.GetCheckedOutBooks))).Methods("GET", "OPTIONS")

	return router
}
