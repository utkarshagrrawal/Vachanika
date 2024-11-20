package routers

import (
	"library/api/handlers"
	"library/api/middlewares"
	"net/http"

	"github.com/gorilla/mux"
)

func AuthRouter() *mux.Router {
	router := mux.NewRouter()

	router.HandleFunc("/signup", handlers.CreateUser).Methods("POST", "OPTIONS")
	router.HandleFunc("/signin", handlers.LoginUser).Methods("POST", "OPTIONS")
	router.Handle("/change-password", middlewares.VerifyToken(http.HandlerFunc(handlers.ChangePassword))).Methods("PUT", "OPTIONS")

	return router
}
