package handlers

import (
	"encoding/json"
	"library/api/services"
	"library/models"
	"net/http"
	"os"

	"github.com/gorilla/mux"
)

func GetUserDetails(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	email, ok := r.Context().Value(models.UserToken("token")).(string)
	if !ok {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode("Error getting the user session")
		return
	}
	userDetails, err := services.UserDetailsService(email)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode("Error getting the user details")
		return
	}
	json.NewEncoder(w).Encode(userDetails)
}

func UpdateUserDetails(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	email, ok := r.Context().Value(models.UserToken("token")).(string)
	if !ok {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode("Error getting the user session")
		return
	}
	var updatedDetails models.UserDetails
	if err := json.NewDecoder(r.Body).Decode(&updatedDetails); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode("Error getting the updated user details")
		return
	}
	userUpdateResponse := services.UpdateUserDetailsService(email, &updatedDetails)
	if userUpdateResponse != "Profile updated successfully" {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(userUpdateResponse)
		return
	}
	if email != updatedDetails.Email {
		cookie := http.Cookie{
			Name:     "token",
			Value:    "invalid",
			Path:     "/api/v1",
			MaxAge:   -1,
			HttpOnly: true,
		}
		if os.Getenv("ENV") == "prod" {
			cookie.Secure = true
			cookie.SameSite = http.SameSiteNoneMode
		}
		http.SetCookie(w, &cookie)
		json.NewEncoder(w).Encode("Profile updated successfully. Please login again.")
		return
	}
	json.NewEncoder(w).Encode(userUpdateResponse)
}

func DeleteUser(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	email, ok := r.Context().Value(models.UserToken("token")).(string)
	if !ok {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode("Error retrieving user session info")
		return
	}
	deleteUserResponse, err := services.DeleteUserService(email)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(deleteUserResponse)
		return
	}
	json.NewEncoder(w).Encode(deleteUserResponse)
}

func VerifyDeleteAccount(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	params := mux.Vars(r)
	deleteAccountVerificationResult := services.VerifyDeleteAccountService(params["deletionToken"])
	if deleteAccountVerificationResult != "Token is valid" {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(deleteAccountVerificationResult)
		return
	}
	json.NewEncoder(w).Encode(deleteAccountVerificationResult)
}
