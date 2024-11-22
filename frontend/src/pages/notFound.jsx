import BookIcon from "../components/icons/bookIcon";
import SearchIcon from "../components/icons/searchIcon";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full bg-gray-100">
      <div className="container mx-auto py-8">
        <h1 className="text-6xl font-bold text-center text-gray-800">404</h1>
        <p className="text-xl text-center text-gray-600">
          Oops! This page seems to be missing from our library.
        </p>
        <div className="w-full flex flex-col justify-center bg-white rounded-lg mt-8 p-4">
          <div className="w-full flex items-center gap-3">
            <BookIcon className="w-6 h-6 text-gray-600" />
            <span className="text-xl font-semibold text-gray-700">
              Lost Book finder
            </span>
          </div>
          <div className="w-full flex justify-center mt-4 gap-2">
            <input
              type="text"
              placeholder="Search for a lost book..."
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm placeholder-gray-400"
            />
            <button className="text-sm font-semibold text-center py-2 px-4 rounded border ml-2">
              <SearchIcon className="w-4 h-4 text-gray-600" />
            </button>
          </div>
        </div>
        <div className="w-full flex justify-center mt-8">
          <button
            className="text-sm font-semibold text-center py-2 px-4 rounded border bg-white"
            onClick={() => (window.location.href = "/")}
          >
            Return to Library Homepage
          </button>
        </div>
      </div>
    </div>
  );
}
