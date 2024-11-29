package database

import (
	"database/sql"
	"library/models"
	"os"

	"github.com/go-sql-driver/mysql"
	"golang.org/x/crypto/bcrypt"
)

var DatabaseConnection *models.App

func init() {
	config := mysql.Config{
		User:      os.Getenv("DB_USER"),
		Passwd:    os.Getenv("DB_PASSWORD"),
		Net:       "tcp",
		Addr:      os.Getenv("DB_ADDRESS"),
		DBName:    "library",
		ParseTime: true,
	}
	db, err := sql.Open("mysql", config.FormatDSN())
	if err != nil {
		panic(err)
	}
	err = db.Ping()
	if err != nil {
		panic(err)
	}
	if _, err := db.Exec("CREATE TABLE IF NOT EXISTS USERS (NAME NVARCHAR(200), EMAIL NVARCHAR(250) PRIMARY KEY, PASSWORD NVARCHAR(70), GENDER NVARCHAR(10), PHONE NVARCHAR(15), ROLE NVARCHAR(10), DOB DATE)"); err != nil {
		panic(err)
	}
	var doesAdminExist int
	if err := db.QueryRow("SELECT COUNT(*) FROM USERS WHERE ROLE = 'admin'").Scan(&doesAdminExist); err != nil {
		panic(err)
	}
	if doesAdminExist == 0 {
		hashedBytes, err := bcrypt.GenerateFromPassword([]byte(os.Getenv("ADMIN_PASSWORD")), bcrypt.DefaultCost)
		if err != nil {
			panic(err)
		}
		if _, err := db.Exec("INSERT INTO USERS (NAME, EMAIL, PASSWORD, GENDER, PHONE, ROLE, DOB) VALUES (?, ?, ?, ?, ?, ?, ?)", os.Getenv("ADMIN_NAME"), os.Getenv("ADMIN_EMAIL"), string(hashedBytes), "M", "1234567890", "admin", "2000-01-01"); err != nil {
			panic(err)
		}
	}
	DatabaseConnection = &models.App{DB: db}
}
