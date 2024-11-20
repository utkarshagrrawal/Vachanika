package handlers

import (
	"encoding/json"
	"library/api/services"
	"library/models"
	"net/http"
	"os"
)

func CreateUser(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	var user models.NewUser
	err := json.NewDecoder(r.Body).Decode(&user)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode("Error getting the user details")
		return
	}
	if len(user.Password) > 48 {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode("Password cannot be greater than 48 characters")
		return
	}
	userCreationResponse := services.CreateUserService(&user)
	if userCreationResponse != "User created successfully" {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(userCreationResponse)
		return
	}
	json.NewEncoder(w).Encode(userCreationResponse)
}

func LoginUser(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	var user models.UserLogin
	err := json.NewDecoder(r.Body).Decode(&user)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode("Error getting the user details")
		return
	}
	tokenOrErrorMessage, err := services.LoginUserService(&user)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(tokenOrErrorMessage)
		return
	}
	cookie := http.Cookie{
		Name:     "token",
		Value:    tokenOrErrorMessage,
		MaxAge:   24 * 60 * 60,
		Path:     "/api/v1",
		HttpOnly: true,
	}
	if os.Getenv("ENV") == "prod" {
		cookie.SameSite = http.SameSiteNoneMode
		cookie.Secure = true
	}
	http.SetCookie(w, &cookie)
	json.NewEncoder(w).Encode("Login successfull")
}

func ChangePassword(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	email, ok := r.Context().Value(models.UserToken("token")).(string)
	if !ok {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode("Error retrieving the user session")
		return
	}
	var updatePasswordPayload models.PasswordModification
	if err := json.NewDecoder(r.Body).Decode(&updatePasswordPayload); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode("Error reading the payload")
		return
	}
	if len(updatePasswordPayload.NewPassword) > 48 {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode("Password cannot be greater than 48 characters")
		return
	}
	changePasswordResponse := services.ChangePasswordService(email, &updatePasswordPayload)
	if changePasswordResponse != "Password changed successfully" {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(changePasswordResponse)
		return
	}
	json.NewEncoder(w).Encode(changePasswordResponse)
}
