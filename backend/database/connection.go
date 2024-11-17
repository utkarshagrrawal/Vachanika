package database

import (
	"database/sql"
	"library/models"
	"os"

	"github.com/go-sql-driver/mysql"
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
	DatabaseConnection = &models.App{DB: db}
}
