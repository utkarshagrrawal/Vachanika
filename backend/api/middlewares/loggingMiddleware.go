package middlewares

import (
	"log"
	"net/http"
)

func GenerateLogs(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		log.Printf("%s request to path: %s", r.Method, r.URL.Path)
		next.ServeHTTP(w, r)
	})
}
