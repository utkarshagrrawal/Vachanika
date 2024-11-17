package routers

import (
	"library/api/handlers"
	"library/api/middlewares"
	"net/http"

	"github.com/gorilla/mux"
)

func AuthRouter() *mux.Router {
	router := mux.NewRouter()

	router.Use(middlewares.GenerateLogs)
	router.Use(middlewares.ApplyCORS)

	router.HandleFunc("/api/v1/auth/signup", handlers.CreateUser).Methods("POST", "OPTIONS")
	router.HandleFunc("/api/v1/auth/signin", handlers.LoginUser).Methods("POST", "OPTIONS")
	router.Handle("/api/v1/auth/user", middlewares.VerifyToken(http.HandlerFunc(handlers.GetUserDetails))).Methods("GET", "OPTIONS")

	return router
}
