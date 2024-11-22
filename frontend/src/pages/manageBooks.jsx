import { useState } from "react";

export default function ManageBooks() {
  const [section, setSection] = useState("search");

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto py-8">
        <h1 className="text-4xl font-bold text-left text-gray-800">
          Welcome, Librarian
        </h1>
        <p className="mt-4 text-xl text-left text-gray-600">
          Manage the library with ease
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
          <div className="bg-white border border-gray-300 p-6 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold">Total Books</span>
              <span className="text-gray-500 text-sm">#</span>
            </div>
            <div className="mt-4 flex flex-col justify-center">
              <span className="text-lg font-bold">2232</span>
              <span className="text-gray-600 text-xs">+20 this month</span>
            </div>
          </div>
          <div className="bg-white border border-gray-300 p-6 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold">Checked out</span>
              <span className="text-gray-500 text-sm">#</span>
            </div>
            <div className="mt-4 flex flex-col justify-center">
              <span className="text-lg font-bold">23</span>
              <span className="text-gray-600 text-xs">+20 from yesterday</span>
            </div>
          </div>
          <div className="bg-white border border-gray-300 p-6 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold">Overdue</span>
              <span className="text-gray-500 text-sm">/</span>
            </div>
            <div className="mt-4 flex flex-col justify-center">
              <span className="text-lg font-bold">18</span>
              <span className="text-gray-600 text-xs">-6 from last week</span>
            </div>
          </div>
        </div>
        <div className="mt-8 bg-white p-6 border border-gray-300 rounded-lg">
          <h2 className="text-lg font-semibold text-gray-800">
            Book Management
          </h2>
          <p className="text-xs text-gray-500">
            Add, search, and manage library books
          </p>
          <div className="grid grid-cols-3 gap-2 bg-gray-100 p-1 rounded-lg mt-4">
            <div
              className={`p-1 text-center text-sm font-semibold hover:cursor-pointer ${
                section === "search" && "bg-white"
              }`}
              onClick={() => setSection("search")}
            >
              Search Books
            </div>
            <div
              className={`p-1 text-center text-sm font-semibold hover:cursor-pointer ${
                section === "add-book" && "bg-white"
              }`}
              onClick={() => setSection("add-book")}
            >
              Add Book
            </div>
            <div
              className={`p-1 text-center text-sm font-semibold  hover:cursor-pointer ${
                section === "process-return" && "bg-white"
              }`}
              onClick={() => setSection("process-return")}
            >
              Process Returns
            </div>
          </div>
          {section === "search" && (
            <div className="mt-4 flex gap-2 items-center">
              <input
                type="text"
                placeholder="Search for a book..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm placeholder-gray-400"
              />
              <button className="text-sm font-semibold text-center py-2 px-4 rounded-lg border ml-2">
                Search
              </button>
            </div>
          )}
          {section === "add-book" && (
            <div className="mt-4 flex flex-col gap-2">
              <label className="text-sm font-semibold">Book Title</label>
              <input
                type="text"
                placeholder="Book Title"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm placeholder-gray-400"
              />
              <label className="text-sm font-semibold">Author</label>
              <input
                type="text"
                placeholder="Author"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm placeholder-gray-400"
              />
              <label className="text-sm font-semibold">Genre</label>
              <input
                type="text"
                placeholder="Genre"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm placeholder-gray-400"
              />
              <label className="text-sm font-semibold">ISBN</label>
              <input
                type="number"
                placeholder="ISBN"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm placeholder-gray-400"
              />
              <label className="text-sm font-semibold">Quantity</label>
              <input
                type="number"
                placeholder="Quantity"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm placeholder-gray-400"
              />
              <button className="bg-gray-900 text-white text-sm font-semibold text-center py-2 px-4 rounded-lg border">
                Add Book
              </button>
            </div>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
          <div className="bg-white p-6 border border-gray-300 rounded-lg">
            <h1 className="text-lg text-gray-800 font-semibold">
              Recent Activities
            </h1>
            <div className="flex flex-col gap-2 mt-4">
              <span className="text-sm text-gray-800">
                Joe just checked out "Hi"
              </span>
              <span className="text-sm text-gray-800">
                Jane returned "Hello"
              </span>
              <span className="text-sm text-gray-800">John added "Hola"</span>
            </div>
          </div>
          <div className="bg-white p-6 border border-gray-300 rounded-lg">
            <h1 className="text-lg text-gray-800 font-semibold">
              Quick Actions
            </h1>
            <div className="flex flex-col gap-2 mt-4">
              <span className="text-sm text-gray-800">Add a book</span>
              <span className="text-sm text-gray-800">Search for a book</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
