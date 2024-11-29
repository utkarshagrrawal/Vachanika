package main

import (
	"library/api/middlewares"
	"library/api/routers"
	"net/http"
	"os"

	"github.com/gorilla/mux"
)

func main() {
	mainRouter := mux.NewRouter()

	mainRouter.Use(middlewares.ApplyCORS)
	mainRouter.Use(middlewares.GenerateLogs)

	mainRouter.PathPrefix("/api/v1/auth").Handler(http.StripPrefix("/api/v1/auth", routers.AuthRouter()))
	mainRouter.PathPrefix("/api/v1/user").Handler(http.StripPrefix("/api/v1/user", routers.UserRouter()))
	mainRouter.PathPrefix("/api/v1/library").Handler(http.StripPrefix("/api/v1/library", routers.LibraryRouter()))
	mainRouter.PathPrefix("/api/v1/admin").Handler(http.StripPrefix("/api/v1/admin", routers.AdminRouter()))

	port := ":" + os.Getenv("PORT")

	http.ListenAndServe(port, mainRouter)
}
