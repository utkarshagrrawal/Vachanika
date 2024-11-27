import axios from "axios";
import { useEffect, useState } from "react";
import BookIcon from "../components/icons/bookIcon";
import StarIcon from "../components/icons/starIcon";

export default function BrowseBooks() {
  const [filters, setFilters] = useState({
    search: "",
    genre: "",
    minRating: 0,
  });
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [books, setBooks] = useState([]);

  useEffect(() => {
    axios
      .get(import.meta.env.VITE_API_URL + "/api/v1/user/details", {
        withCredentials: true,
      })
      .then((res) => {})
      .catch((err) => {
        window.location.href = "/signin?next=" + encodeURIComponent("/browse");
      });
  }, []);

  useEffect(() => {
    axios
      .get(
        import.meta.env.VITE_API_URL + "/api/v1/library/books?page=" + page,
        {
          withCredentials: true,
        }
      )
      .then((res) => {
        res.status === 200 && setBooks(res.data);
      })
      .catch((err) => {
        setError(
          err.response?.data || "An error occurred while fetching books"
        );
      });
  }, [page]);

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

        <div className="flex flex-wrap md:flex-nowrap justify-center md:justify-between items-center gap-4 w-full">
          <div className="flex-grow">
            <input
              type="text"
              id="search"
              autoFocus
              value={filters.search}
              onChange={handleFiltersChange}
              placeholder="Search for a book..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm placeholder-gray-400 transition duration-200"
            />
          </div>

          <div className="flex-grow md:flex-none">
            <select
              id="genre"
              value={filters.genre}
              onChange={handleFiltersChange}
              className="w-full md:w-52 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm transition duration-200"
            >
              <option value="">All Genres</option>
              <option value="fiction">Fiction</option>
              <option value="non-fiction">Non-Fiction</option>
              <option value="mystery">Mystery</option>
              <option value="thriller">Thriller</option>
              <option value="fantasy">Fantasy</option>
              <option value="romance">Romance</option>
            </select>
          </div>

          <div className="flex justify-between items-center gap-2 min-w-72">
            <label className="text-sm font-semibold text-gray-700 whitespace-nowrap">
              Min Rating:
            </label>
            <input
              type="range"
              id="minRating"
              value={filters.minRating}
              onChange={handleFiltersChange}
              min="0"
              max="5"
              step="0.5"
              className="w-28 md:w-40 h-2 bg-gray-200 rounded-lg cursor-pointer accent-indigo-500"
            />
            <span className="text-sm font-semibold text-gray-700">
              {filters.minRating}
            </span>
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
