import { useState } from "react";
import SearchIcon from "../components/icons/searchIcon";

export default function BrowseBooks() {
  const [filters, setFilters] = useState({
    search: "",
    genre: "",
    minRating: 0,
  });

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
        <div className="bg-white rounded-lg flex flex-wrap md:flex-nowrap justify-center md:justify-between items-center gap-4 border w-full p-6 shadow-md">
          <div className="flex-grow">
            <input
              type="text"
              id="search"
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

          <div className="flex items-center gap-2 min-w-72">
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
      </div>
    </div>
  );
}
