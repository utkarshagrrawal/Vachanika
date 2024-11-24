package models

type AddBookRequest struct {
	ISBN     string `json:"isbn"`
	Quantity int    `json:"quantity"`
}

type Books struct {
	ISBN      string `json:"isbn"`
	Title     string `json:"title"`
	Author    string `json:"author"`
	Publisher string `json:"publisher"`
	Genre     string `json:"genre"`
	Quantity  string `json:"quantity"`
}

type OpenLibraryResponse struct {
	NumFound int                       `json:"numFound"`
	Docs     []OpenLibraryResponseDocs `json:"docs"`
}

type OpenLibraryResponseDocs struct {
	AuthorName []string `json:"author_name"`
	Title      string   `json:"title"`
	Subject    []string `json:"subject"`
	Publisher  []string `json:"publisher"`
}
