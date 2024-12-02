import axios from "axios";
import { useEffect, useRef, useState } from "react";
import BookIcon from "../components/icons/bookIcon";
import StarIcon from "../components/icons/starIcon";

function debounce(fn, delay) {
  let timer;
  return function (...args) {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

export default function BrowseBooks() {
  const genreOptions = [
    "Fiction",
    "Non-Fiction",
    "Fantasy",
    "Science Fiction",
    "Mystery",
    "Thriller",
    "Romance",
    "Horror",
    "Biography",
    "Autobiography",
    "History",
    "Science",
    "Self-help",
    "Cookbooks",
    "Travel",
    "Art",
    "Poetry",
    "Religion",
    "Philosophy",
    "Children",
    "Young Adult",
    "Comics",
    "Manga",
    "Graphic Novels",
    "Others",
  ];

  const [filters, setFilters] = useState({
    search: "",
    genre: "",
    rating: 0,
  });
  const [error, setError] = useState("");
  const scrollRef = useRef(0);
  const [page, setPage] = useState(1);
  const [books, setBooks] = useState([]);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.scrollY > scrollRef.current &&
        window.innerHeight + window.scrollY >=
          document.documentElement.scrollHeight
      ) {
        scrollRef.current = window.scrollY;
        setPage((prev) => prev + 1);
      }
    };
    const debouncedHandleScroll = debounce(handleScroll, 500);
    window.addEventListener("scroll", debouncedHandleScroll);
    return () => window.removeEventListener("scroll", debouncedHandleScroll);
  }, []);

  useEffect(() => {
    axios
      .get(import.meta.env.VITE_API_URL + "/api/v1/user/details", {
        withCredentials: true,
      })
      .then((res) => {})
      .catch((err) => {
        if (err.code !== "ECONNABORTED") {
          window.location.href =
            "/signin?next=" + encodeURIComponent("/browse");
        }
      });
  }, []);

  useEffect(() => {
    if (filters.search !== "" || filters.genre !== "" || filters.rating !== 0) {
      setPage(1);
    }
    axios
      .get(
        `${
          import.meta.env.VITE_API_URL
        }/api/v1/library/books?page=${page}&search=${filters.search}&genre=${
          filters.genre
        }&rating=${filters.rating === 0 ? "" : filters.rating.toString()}`,
        {
          withCredentials: true,
        }
      )
      .then((res) => {
        if (page === 1) setBooks(res.data || []);
        else setBooks((prev) => [...prev, ...(res.data || [])]);
      })
      .catch((err) => {
        setError(
          err.response?.data || "An error occurred while fetching books"
        );
      });
  }, [page, filters]);

  const handleFiltersChange = (e) => {
    setFilters({
      ...filters,
      [e.target.id]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto py-8 space-y-6">
        <h1 className="text-4xl font-bold text-center text-gray-800">
          Explore our Library
        </h1>
        <p className="text-lg text-center text-gray-600">
          Discover your next favorite book
        </p>

        <div
          className={`w-full border rounded-lg p-2 text-sm font-semibold text-center ${
            !error ? "hidden" : "bg-red-100 border-red-300 text-red-700"
          }`}
        >
          {error}
        </div>

        <div className="flex flex-wrap gap-4 items-center justify-center md:justify-between w-full p-4 bg-gray-50 border border-gray-200 rounded-lg shadow-md">
          <div className="flex-grow">
            <input
              type="text"
              id="search"
              autoFocus
              value={filters.search}
              onChange={handleFiltersChange}
              placeholder="Search books..."
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 text-sm placeholder-gray-500 transition duration-200"
            />
          </div>

          <div className="flex-grow md:flex-none">
            <select
              id="genre"
              value={filters.genre}
              onChange={handleFiltersChange}
              className="w-full md:w-52 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 text-sm transition duration-200"
            >
              <option value="">All Genres</option>
              {genreOptions.map((genre, index) => (
                <option key={index} value={genre}>
                  {genre}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-4">
            <label className="text-sm font-medium text-gray-700">
              Min rating:
            </label>
            {[...Array(5)].map((_, index) => (
              <button
                key={index}
                onClick={() =>
                  setFilters((prev) => ({ ...prev, rating: index + 1 }))
                }
              >
                <StarIcon
                  className={`h-6 w-6 cursor-pointer transition-colors duration-150 ${
                    index < filters.rating ? "text-yellow-500" : "text-gray-300"
                  }`}
                  fill={"currentColor"}
                />
              </button>
            ))}
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {books.length > 0 ? (
            books.map((book, index) => (
              <div className="bg-white rounded-lg shadow-md p-4" key={index}>
                <h2 className="text-xl font-semibold text-gray-900">
                  {book.title}
                </h2>
                <h5 className="mt-4 text-sm font-medium text-gray-600">
                  {book.author}
                </h5>
                <div className="flex items-center mt-2">
                  <StarIcon className="h-4 w-4 text-yellow-500" />
                  <span className="text-sm font-semibold text-gray-800 ml-1">
                    {book.rating || "0"}
                  </span>
                </div>
                <button
                  className="flex justify-center items-center w-full mt-4 rounded-lg border border-gray-200 text-sm font-semibold px-4 py-2 hover:bg-black hover:text-white transition-colors duration-400"
                  onClick={() => (window.location.href = "/book/" + book.isbn)}
                >
                  <BookIcon className="h-4 w-4 mr-2" />
                  View Details
                </button>
              </div>
            ))
          ) : (
            <div className="w-full text-center text-gray-600">
              No books found
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
