package routers

import (
	"library/api/handlers"
	"library/api/middlewares"
	"net/http"

	"github.com/gorilla/mux"
)

func AdminRouter() *mux.Router {
	router := mux.NewRouter()

	router.Handle("/users", middlewares.VerifyToken(http.HandlerFunc(handlers.GetUsers))).Methods("GET", "OPTIONS")
	router.Handle("/users", middlewares.VerifyToken(http.HandlerFunc(handlers.UpdateUserRole))).Methods("PUT", "OPTIONS")

	return router
}
