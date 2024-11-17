package services

import (
	"database/sql"
	"fmt"
	"library/database"
	"library/models"
	"os"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
)

func CreateUserService(u *models.NewUser) string {
	_, err := database.DatabaseConnection.DB.Exec("CREATE TABLE IF NOT EXISTS USERS (NAME NVARCHAR(200), EMAIL NVARCHAR(250), PASSWORD NVARCHAR(70), GENDER NVARCHAR(10), PHONE NVARCHAR(15), ROLE NVARCHAR(10), DOB DATE)")
	if err != nil {
		return "Error finding the user table in the Database"
	}
	hashedBytes, err := bcrypt.GenerateFromPassword([]byte(u.Password), bcrypt.DefaultCost)
	if err != nil {
		return "Error create the hash for the password"
	}
	_, err = database.DatabaseConnection.DB.Exec("INSERT INTO USERS (NAME, EMAIL, PASSWORD, GENDER, PHONE, ROLE, DOB) VALUES (?, ?, ?, ?, ?, ?, ?)", u.Name, u.Email, string(hashedBytes), u.Gender, u.Phone, u.Role, u.DOB)
	if err != nil {
		fmt.Println(err)
		return "Error creating the user"
	}
	return "User created successfully"
}

func LoginUserService(u *models.UserLogin) (string, error) {
	_, err := database.DatabaseConnection.DB.Exec("CREATE TABLE IF NOT EXISTS USERS (NAME NVARCHAR(200), EMAIL NVARCHAR(250), PASSWORD NVARCHAR(70), GENDER NVARCHAR(10), PHONE NVARCHAR(15), ROLE NVARCHAR(10), DOB DATE)")
	if err != nil {
		return "Error finding the user table in the Database", err
	}
	result := database.DatabaseConnection.DB.QueryRow("SELECT PASSWORD FROM USERS WHERE EMAIL = ?", u.Email)
	var password string
	if err := result.Scan(&password); err == sql.ErrNoRows {
		return "User not found", err
	} else if err != nil {
		return "Error getting the user details", err
	}
	err = bcrypt.CompareHashAndPassword([]byte(password), []byte(u.Password))
	if err != nil {
		return "Invalid password", err
	}
	var expiryTime int64
	if u.RememberMe {
		expiryTime = time.Now().Add(24 * 7 * time.Hour).Unix()
	} else {
		expiryTime = time.Now().Add(24 * time.Hour).Unix()
	}
	token, err := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"email": u.Email,
		"exp":   expiryTime,
	}).SignedString([]byte(os.Getenv("APP_SECRET")))
	if err != nil {
		return "Error creating the session for user", err
	}
	return token, nil
}

func UserDetailsService(email string) (user models.UserDetails, err error) {
	_, err = database.DatabaseConnection.DB.Exec("CREATE TABLE IF NOT EXISTS USERS (NAME NVARCHAR(200), EMAIL NVARCHAR(250), PASSWORD NVARCHAR(70), GENDER NVARCHAR(10), PHONE NVARCHAR(15), ROLE NVARCHAR(10), DOB DATE)")
	if err != nil {
		return
	}
	result := database.DatabaseConnection.DB.QueryRow("SELECT NAME, EMAIL, GENDER, PHONE, ROLE, DOB FROM USERS WHERE EMAIL = ?", email)
	if err = result.Scan(&user.Name, &user.Email, &user.Gender, &user.Phone, &user.Role, &user.DOB); err == sql.ErrNoRows {
		return
	} else if err != nil {
		return
	}
	return
}
