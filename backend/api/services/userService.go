package services

import (
	"database/sql"
	"library/database"
	"library/models"
	"time"

	"github.com/google/uuid"
)

func UserDetailsService(email string) (user models.UserDetails, err error) {
	_, err = database.DatabaseConnection.DB.Exec("CREATE TABLE IF NOT EXISTS USERS (NAME NVARCHAR(200), EMAIL NVARCHAR(250) PRIMARY KEY, PASSWORD NVARCHAR(70), GENDER NVARCHAR(10), PHONE NVARCHAR(15), ROLE NVARCHAR(10), DOB DATE)")
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

func UpdateUserDetailsService(oldEmail string, u *models.UserDetails) string {
	if oldEmail != u.Email {
		row := database.DatabaseConnection.DB.QueryRow("SELECT NAME FROM USERS WHERE EMAIL = ?", u.Email)
		var name string
		if err := row.Scan(&name); err != sql.ErrNoRows && err != nil {
			return "Error checking if user exists with new mail address"
		} else if name != "" {
			return "User already exists with this mail address"
		}
	}
	_, err := database.DatabaseConnection.DB.Exec("UPDATE USERS SET NAME = ?, EMAIL = ?, PHONE = ?, GENDER = ?, DOB = ? WHERE EMAIL = ?", u.Name, u.Email, u.Phone, u.Gender, u.DOB, oldEmail)
	if err != nil {
		return "Error updating user details"
	}
	// TODO: update the records for borrowed items or anywhere the email id is used to identify
	return "Profile updated successfully"
}

func DeleteUserService(email string) (string, error) {
	_, err := database.DatabaseConnection.DB.Exec("CREATE TABLE IF NOT EXISTS DELETION_CONFIRM (UUID NVARCHAR(50) PRIMARY KEY, EXPIRE_AT INT)")
	if err != nil {
		return "Error while generating deletion request", err
	}
	transaction, err := database.DatabaseConnection.DB.Begin()
	if err != nil {
		return "Error starting the deletion process", err
	}
	deletionToken := uuid.NewString()
	_, err = transaction.Exec("INSERT INTO DELETION_CONFIRM VALUES (?, ?)", deletionToken, time.Now().Add(5*time.Minute).Unix())
	if err != nil {
		return "Error while creating the deletion token", err
	}
	_, err = transaction.Exec("DELETE FROM USERS WHERE EMAIL = ?", email)
	if err != nil {
		transaction.Rollback()
		return "Error while deleting the user", err
	}
	_, err = transaction.Exec("DELETE FROM BORROW_HISTORY WHERE USER_EMAIL = ?", email)
	if err != nil {
		transaction.Rollback()
		return "Error while deleting the user's borrow history", err
	}
	_, err = transaction.Exec("DELETE FROM USER_WISHLIST WHERE USER_EMAIL = ?", email)
	if err != nil {
		transaction.Rollback()
		return "Error while deleting the user's wishlist", err
	}
	_, err = transaction.Exec("DELETE FROM BOOK_REVIEWS WHERE USER_EMAIL = ?", email)
	if err != nil {
		transaction.Rollback()
		return "Error while deleting the user's reviews", err
	}
	err = transaction.Commit()
	if err != nil {
		return "Error while completing the deletion process", err
	}
	return deletionToken, nil
}

func VerifyDeleteAccountService(token string) string {
	result := database.DatabaseConnection.DB.QueryRow("SELECT * FROM DELETION_CONFIRM WHERE UUID = ?", token)
	var entry models.DeletionConfirmationEntry
	if err := result.Scan(&entry.Identifier, &entry.ExpireAt); err != nil {
		return "Error getting the user token details"
	} else if int(time.Now().Unix())-entry.ExpireAt > 300 {
		return "Invalid token"
	}
	_, err := database.DatabaseConnection.DB.Exec("DELETE FROM DELETION_CONFIRM WHERE UUID = ?", token)
	if err != nil {
		return "Error deleting the token"
	}
	_, err = database.DatabaseConnection.DB.Exec("DELETE FROM DELETION_CONFIRM WHERE EXPIRE_AT < ?", time.Now().Unix())
	if err != nil {
		return "Error deleting the expired tokens"
	}
	return "Token is valid"
}

func GetCheckedOutBooksService(email string) ([]models.BorrowedBook, string) {
	var books []models.BorrowedBook
	if _, err := database.DatabaseConnection.DB.Exec("CREATE TABLE IF NOT EXISTS BORROW_HISTORY (USER_EMAIL NVARCHAR(250), BOOK_ISBN NVARCHAR(15), CHECKOUT_DATE DATE, RETURN_DATE DATE, RETURNED BOOLEAN, OVERDUE BOOLEAN, LOST BOOLEAN, PRIMARY KEY(USER_EMAIL, BOOK_ISBN, CHECKOUT_DATE, RETURN_DATE))"); err != nil {
		return books, "An error occurred while accessing the borrow history table."
	}
	rows, err := database.DatabaseConnection.DB.Query("SELECT b.ISBN, b.TITLE, b.AUTHOR, b.PUBLISHER, bh.CHECKOUT_DATE, bh.RETURN_DATE, bh.RETURNED, bh.OVERDUE FROM BOOKS b INNER JOIN BORROW_HISTORY bh ON b.ISBN = bh.BOOK_ISBN WHERE bh.USER_EMAIL = ? AND bh.RETURNED = ? AND bh.LOST = ?", email, false, false)
	if err != nil {
		return books, "An error occurred while accessing the database."
	}
	defer rows.Close()
	for rows.Next() {
		var book models.BorrowedBook
		if err := rows.Scan(&book.ISBN, &book.Title, &book.Author, &book.Publisher, &book.CheckoutDate, &book.ReturnDate, &book.Returned, &book.Overdue); err != nil {
			return books, "An error occurred while reading the book details."
		}
		books = append(books, book)
	}
	return books, ""
}
