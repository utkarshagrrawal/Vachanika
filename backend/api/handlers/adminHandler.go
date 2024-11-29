package handlers

import (
	"encoding/json"
	"library/api/services"
	"library/models"
	"net/http"
	"strconv"
)

func GetUsers(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	values := r.URL.Query()
	page := values.Get("page")
	if page == "" {
		page = "1"
	}
	pageNumber, err := strconv.Atoi(page)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode("Invalid page number")
		return
	}
	users, errMessage := services.GetUsersService(pageNumber)
	if errMessage != "" {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(errMessage)
		return
	}
	json.NewEncoder(w).Encode(users)
}

func UpdateUserRole(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	var userRole models.UserRoleUpdate
	err := json.NewDecoder(r.Body).Decode(&userRole)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode("Invalid request")
		return
	}
	message := services.UpdateUserRoleService(&userRole)
	if message != "User role updated successfully" {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(message)
		return
	}
	json.NewEncoder(w).Encode("User role updated successfully")
}
