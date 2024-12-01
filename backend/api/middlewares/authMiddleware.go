package middlewares

import (
	"context"
	"encoding/json"
	"library/models"
	"net/http"
	"os"

	"github.com/golang-jwt/jwt/v5"
)

func VerifyToken(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		cookie, err := r.Cookie("token")
		if err != nil {
			w.WriteHeader(http.StatusBadRequest)
			json.NewEncoder(w).Encode("Error retrieving user session info")
			return
		}
		token := cookie.Value
		var jwtClaims jwt.MapClaims
		_, err = jwt.ParseWithClaims(token, &jwtClaims, func(t *jwt.Token) (interface{}, error) {
			return []byte(os.Getenv("APP_SECRET")), nil
		})
		if err != nil {
			if err == jwt.ErrTokenExpired {
				w.WriteHeader(http.StatusUnauthorized)
				json.NewEncoder(w).Encode("Session Expired. Please login again")
				return
			} else {
				w.WriteHeader(http.StatusBadRequest)
				json.NewEncoder(w).Encode("Error retrieving user session details")
				return
			}
		}
		ctx := context.WithValue(r.Context(), models.SessionInfo("email"), jwtClaims["email"])
		ctx = context.WithValue(ctx, models.SessionInfo("role"), jwtClaims["role"])
		r = r.WithContext(ctx)
		next.ServeHTTP(w, r)
	})
}
