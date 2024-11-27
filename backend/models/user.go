package models

import (
	"time"

	"github.com/google/uuid"
)

type NewUser struct {
	Name     string    `json:"name"`
	Email    string    `json:"email"`
	Password string    `json:"password"`
	Phone    string    `json:"phone"`
	Gender   string    `json:"gender"`
	Role     string    `json:"role"`
	DOB      time.Time `json:"dob"`
}

type UserDetails struct {
	Name   string    `json:"name"`
	Email  string    `json:"email"`
	Phone  string    `json:"phone"`
	Gender string    `json:"gender"`
	Role   string    `json:"role"`
	DOB    time.Time `json:"dob"`
}

type UserLogin struct {
	Email      string `json:"email"`
	Password   string `json:"password"`
	RememberMe bool   `json:"rememberMe"`
}

type PasswordModification struct {
	OldPassword string `json:"password"`
	NewPassword string `json:"newPassword"`
}

type DeletionConfirmationEntry struct {
	Identifier uuid.UUID
	ExpireAt   int
}

type UserToken string

type BorrowedBook struct {
	ISBN         string    `json:"isbn"`
	Title        string    `json:"title"`
	Author       string    `json:"author"`
	Publisher    string    `json:"publisher"`
	CheckoutDate time.Time `json:"checkoutDate"`
	ReturnDate   time.Time `json:"returnDate"`
	Returned     bool      `json:"returned"`
	Overdue      bool      `json:"overdue"`
}
