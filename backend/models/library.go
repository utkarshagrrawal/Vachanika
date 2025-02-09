package models

import "time"

type AddBookRequest struct {
	ISBN     string   `json:"isbn"`
	Genres   []string `json:"genres"`
	Quantity int      `json:"quantity"`
}

type LibrarySummary struct {
	TotalBooks               int `json:"totalBooks"`
	BooksAddedThisMonth      int `json:"booksAddedThisMonth"`
	TotalCheckedOut          int `json:"totalCheckedOut"`
	BooksCheckedOutThisMonth int `json:"booksCheckedOutThisMonth"`
	TotalOverdue             int `json:"totalOverdue"`
	BooksOverdueThisMonth    int `json:"booksOverdueThisMonth"`
	TotalLost                int `json:"totalLost"`
	BooksLostThisMonth       int `json:"booksLostThisMonth"`
}

type Books struct {
	ISBN      string  `json:"isbn"`
	Title     string  `json:"title"`
	Author    string  `json:"author"`
	Publisher string  `json:"publisher"`
	Genre     string  `json:"genre"`
	Quantity  string  `json:"quantity"`
	Rating    float64 `json:"rating"`
}

type OpenLibraryResponse struct {
	NumFound int                       `json:"numFound"`
	Docs     []OpenLibraryResponseDocs `json:"docs"`
}

type OpenLibraryResponseDocs struct {
	AuthorName []string `json:"author_name"`
	Title      string   `json:"title"`
	Publisher  []string `json:"publisher"`
}

type BorrowedBook struct {
	ISBN         string    `json:"isbn"`
	Title        string    `json:"title"`
	Author       string    `json:"author"`
	Publisher    string    `json:"publisher"`
	CheckoutDate time.Time `json:"checkoutDate"`
	ReturnDate   time.Time `json:"returnDate"`
	Returned     bool      `json:"returned"`
	Overdue      bool      `json:"overdue"`
	Lost         bool      `json:"lost"`
}

type BorrowBookRequest struct {
	ISBN string `json:"isbn"`
}

type BookManagementRequest struct {
	ISBN   string `json:"isbn"`
	Email  string `json:"email"`
	Review string `json:"review"`
	Rating int    `json:"rating"`
}

type BookReviews struct {
	Review string `json:"review"`
	Rating int    `json:"rating"`
}

type UserWishlist struct {
	ISBN     string `json:"isbn"`
	Title    string `json:"title"`
	Author   string `json:"author"`
	Quantity int    `json:"quantity"`
}

type LibraryActivity struct {
	Email      string    `json:"email"`
	Activity   string    `json:"activity"`
	ActivityOn time.Time `json:"activityOn"`
}
