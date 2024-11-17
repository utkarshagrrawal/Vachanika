package middlewares

import (
	"encoding/json"
	"net/http"
	"net/url"
)

func ApplyCORS(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		var allowedOrigins = make(map[string]bool)
		allowedOrigins["localhost:5173"] = true
		allowedOrigins["vachanika.vercel.app"] = true

		originUrl := r.Header.Get("origin")
		if originUrl != "" {
			origin, err := url.Parse(originUrl)
			if err != nil {
				w.WriteHeader(http.StatusForbidden)
				json.NewEncoder(w).Encode("Error getting the request origin URL details")
				return
			}
			if allowedOrigins[origin.Host] {
				w.Header().Set("Access-Control-Allow-Origin", originUrl)
				w.Header().Set("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE, OPTIONS")
				w.Header().Set("Access-Control-Allow-Headers", "content-type")
				w.Header().Set("Access-Control-Allow-Credentials", "true")
				if r.Method == http.MethodOptions {
					return
				}
				next.ServeHTTP(w, r)
			}
		} else {
			w.WriteHeader(http.StatusForbidden)
			json.NewEncoder(w).Encode("Access forbidden")
			return
		}
	})
}
