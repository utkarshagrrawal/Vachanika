package models

type Books struct {
	ISBN      string `json:"isbn"`
	Title     string `json:"title"`
	Author    string `json:"author"`
	Publisher string `json:"publisher"`
	Genre     string `json:"genre"`
	Quantity  string `json:"quantity"`
}
