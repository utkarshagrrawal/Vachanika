package services

import (
	"library/database"
	"library/models"
)

func GetUsersService(page int) ([]models.UserDetails, string) {
	skip := (page - 1) * 10
	var users []models.UserDetails
	if _, err := database.DatabaseConnection.DB.Exec("CREATE TABLE IF NOT EXISTS USERS (NAME NVARCHAR(200), EMAIL NVARCHAR(250) PRIMARY KEY, PASSWORD NVARCHAR(70), GENDER NVARCHAR(10), PHONE NVARCHAR(15), ROLE NVARCHAR(10), DOB DATE)"); err != nil {
		return users, "Error finding the user table in the Database"
	}
	rows, err := database.DatabaseConnection.DB.Query("SELECT NAME, EMAIL, ROLE FROM USERS WHERE ROLE <> ? LIMIT 10 OFFSET ?", "admin", skip)
	if err != nil {
		return users, "Error finding the user in the Database"
	}
	for rows.Next() {
		var user models.UserDetails
		if err := rows.Scan(&user.Name, &user.Email, &user.Role); err != nil {
			return users, "Error finding the user in the Database"
		}
		users = append(users, user)
	}
	return users, ""
}

func UpdateUserRoleService(u *models.UserRoleUpdate) string {
	_, err := database.DatabaseConnection.DB.Exec("CREATE TABLE IF NOT EXISTS USERS (NAME NVARCHAR(200), EMAIL NVARCHAR(250) PRIMARY KEY, PASSWORD NVARCHAR(70), GENDER NVARCHAR(10), PHONE NVARCHAR(15), ROLE NVARCHAR(10), DOB DATE)")
	if err != nil {
		return "Error finding the user table in the Database"
	}
	_, err = database.DatabaseConnection.DB.Exec("UPDATE USERS SET ROLE = ? WHERE EMAIL = ?", u.Role, u.Email)
	if err != nil {
		return "Error updating the user role in the Database"
	}
	return "User role updated successfully"
}
