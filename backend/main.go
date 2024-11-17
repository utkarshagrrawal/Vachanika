package main

import (
	"library/api/routers"
	"net/http"
	"os"
)

func main() {
	port := ":" + os.Getenv("PORT")
	http.ListenAndServe(port, routers.AuthRouter())
}
