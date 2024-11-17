package models

import "time"

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

type UserToken string
