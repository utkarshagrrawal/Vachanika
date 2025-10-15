import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

function debounce(func, delay) {
  let timeout;
  return function (...args) {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => {
      func(...args);
    }, delay);
  };
}

export default function ManageBooks() {
  const dateFormatter = new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
  });

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

  const { section } = useParams();
  const [filteredGenres, setFilteredGenres] = useState(genreOptions);
  const genresRef = useRef(null);
  const [genresVisible, setGenresVisible] = useState(false);
  const [currentSection, setCurrentSection] = useState(section || "search");
  const [searchResponse, setSearchResponse] = useState("");
  const [searchPage, setSearchPage] = useState(1);
  const scrollRef = useRef(0);
  const [statistics, setStatistics] = useState({});
  const [books, setBooks] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [addBookResponse, setAddBookResponse] = useState("");
  const [newBook, setNewBook] = useState({
    isbn: "",
    genres: [],
    searchText: "",
    quantity: 0,
  });
  const [addingBook, setAddingBook] = useState(false);
  const [activity, setActivity] = useState([]);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.scrollY > scrollRef.current &&
        window.innerHeight + window.scrollY !==
          document.documentElement.offsetHeight
      ) {
        scrollRef.current = window.scrollY;
        setSearchPage((prev) => prev + 1);
      }
    };
    const debouncedScroll = debounce(handleScroll, 100);
    window.addEventListener("scroll", debouncedScroll);
    return () => window.removeEventListener("scroll", debouncedScroll);
  }, []);

  useEffect(() => {
    const genreDropdownListener = (e) => {
      if (
        genresRef.current &&
        !genresRef.current.contains(e.target) &&
        e.target.id !== "searchText"
      ) {
        setGenresVisible(false);
      }
    };
    if (currentSection === "add-book") {
      document.addEventListener("click", genreDropdownListener);
    } else {
      document.removeEventListener("click", genreDropdownListener);
    }
    return () => document.removeEventListener("click", genreDropdownListener);
  }, [currentSection]);

  useEffect(() => {
    axios
      .get(import.meta.env.VITE_API_URL + "/api/v1/user/details", {
        withCredentials: true,
      })
      .then((res) => {
        if (res.data?.role !== "librarian") {
          window.location.href = "/";
        }
      })
      .catch((err) => {
        if (err.code !== "ECONNABORTED") {
          window.location.href =
            "/signin?next=" + encodeURIComponent("/manage-books");
        }
      });
  }, []);

  useEffect(() => {
    axios
      .get(import.meta.env.VITE_API_URL + "/api/v1/library/library-summary", {
        withCredentials: true,
      })
      .then((res) => {
        setStatistics({
          totalBooks: res.data.totalBooks,
          booksAddedThisMonth: res.data.booksAddedThisMonth,
          checkedOut: res.data.totalCheckedOut,
          checkedOutThisMonth: res.data.booksCheckedOutThisMonth,
          overdue: res.data.totalOverdue,
          overdueThisMonth: res.data.booksOverdueThisMonth,
          lost: res.data.totalLost,
          lostThisMonth: res.data.booksLostThisMonth,
        });
      })
      .catch((err) => {
        setSearchResponse(err.response?.data || "An error occurred");
      });
  }, []);

  useEffect(() => {
    const fetchBooks = () => {
      axios
        .get(
          import.meta.env.VITE_API_URL +
            "/api/v1/library/books?page=" +
            searchPage +
            "&search=" +
            searchText,
          {
            withCredentials: true,
          }
        )
        .then((res) => {
          if (searchPage === 1) setBooks(res.data || []);
          else setBooks((prev) => [...prev, ...(res.data || [])]);
        })
        .catch((err) => {
          setSearchResponse(err.response?.data || "An error occurred");
        });
    };
    if (currentSection === "search") {
      setSearchResponse("");
      let timeout = setTimeout(() => {
        fetchBooks();
      }, 300);
      return () => clearTimeout(timeout);
    }
  }, [currentSection, searchPage, searchText]);

  useEffect(() => {
    axios
      .get(import.meta.env.VITE_API_URL + "/api/v1/library/activity?page=1", {
        withCredentials: true,
      })
      .then((res) => {
        setActivity(res.data || []);
      })
      .catch((err) => {
        setActivity([]);
      });
  }, []);

  const handleNewBookDetails = (e) => {
    setNewBook({
      ...newBook,
      [e.target.id]: e.target.id === "genres" ? genres : e.target.value,
    });
    if (e.target.id === "searchText") {
      setFilteredGenres(
        genreOptions.filter((genre) =>
          genre.toLowerCase().includes(e.target.value.toLowerCase())
        )
      );
    }
  };

  const handleAddBook = () => {
    setAddBookResponse("");
    setAddingBook(true);

    if (
      !newBook.isbn ||
      (newBook.isbn.length !== 13 && newBook.isbn.length !== 10) ||
      !newBook.isbn.match(/^[0-9]+$/)
    ) {
      setAddBookResponse("Invalid ISBN");
      setAddingBook(false);
      return;
    }
    if (newBook.genres.length === 0) {
      setAddBookResponse("Select at least one genre");
      setAddingBook(false);
      return;
    }
    if (newBook.quantity > 10 || newBook.quantity < 1) {
      setAddBookResponse("Quantity should be between 1 and 10");
      setAddingBook(false);
      return;
    }

    axios
      .post(
        import.meta.env.VITE_API_URL + "/api/v1/library/add-book",
        {
          isbn: newBook.isbn,
          quantity: parseInt(newBook.quantity),
          genres: newBook.genres,
        },
        {
          withCredentials: true,
        }
      )
      .then((res) => {
        setAddBookResponse(res.data);
      })
      .catch((err) => {
        setAddBookResponse(err.response?.data || "An error occurred");
      })
      .finally(() => {
        setAddingBook(false);
      });
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-4xl font-bold text-left text-gray-800">
          Welcome, Librarian
        </h1>
        <p className="mt-4 text-xl text-left text-gray-600">
          Manage the library with ease
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
          <div className="bg-white border border-gray-300 p-6 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold">Total Books</span>
              <span className="text-gray-500 text-sm">#</span>
            </div>
            <div className="mt-4 flex flex-col justify-center">
              <span className="text-lg font-bold">
                {statistics.totalBooks || 0}
              </span>
              <span className="text-gray-600 text-xs">
                +{statistics.booksAddedThisMonth || 0} this month
              </span>
            </div>
          </div>
          <div className="bg-white border border-gray-300 p-6 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold">Checked out</span>
              <span className="text-gray-500 text-sm">#</span>
            </div>
            <div className="mt-4 flex flex-col justify-center">
              <span className="text-lg font-bold">
                {statistics.checkedOut || 0}
              </span>
              <span className="text-gray-600 text-xs">
                +{statistics.checkedOutThisMonth || 0} this month
              </span>
            </div>
          </div>
          <div className="bg-white border border-gray-300 p-6 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold">Overdue</span>
              <span className="text-gray-500 text-sm">/</span>
            </div>
            <div className="mt-4 flex flex-col justify-center">
              <span className="text-lg font-bold">
                {statistics.overdue || 0}
              </span>
              <span className="text-gray-600 text-xs">
                +{statistics.overdueThisMonth || 0} this month
              </span>
            </div>
          </div>
          <div className="bg-white border border-gray-300 p-6 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold">Lost</span>
              <span className="text-gray-500 text-sm">#</span>
            </div>
            <div className="mt-4 flex flex-col justify-center">
              <span className="text-lg font-bold">{statistics.lost || 0}</span>
              <span className="text-gray-600 text-xs">
                +{statistics.lostThisMonth || 0} this month
              </span>
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
          <div className="grid grid-cols-2 gap-2 bg-gray-100 p-1 rounded-lg mt-4">
            <div
              className={`p-1 text-center text-sm font-semibold hover:cursor-pointer ${
                currentSection === "search" && "bg-white"
              }`}
              onClick={() => setCurrentSection("search")}
            >
              Search Books
            </div>
            <div
              className={`p-1 text-center text-sm font-semibold hover:cursor-pointer ${
                currentSection === "add-book" && "bg-white"
              }`}
              onClick={() => setCurrentSection("add-book")}
            >
              Add Book
            </div>
          </div>
          {currentSection === "search" && (
            <div className="mt-4 flex flex-col">
              <div
                className={`border p-2 rounded-lg text-sm text-center font-semibold ${
                  searchResponse === ""
                    ? "hidden"
                    : "bg-red-50 text-red-500 border-red-500"
                }`}
              >
                {searchResponse}
              </div>
              <input
                type="text"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder="Search for a book..."
                className="mt-4 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm placeholder-gray-400"
              />
              <div className="mt-4 flex flex-col space-y-4">
                {books.length > 0 ? (
                  books.map((book) => (
                    <div
                      key={book.isbn}
                      className="flex gap-4 items-center justify-between bg-white shadow-md py-2 px-4 border rounded-lg hover:shadow-lg transition-shadow duration-200 hover:cursor-pointer"
                      onClick={() =>
                        (window.location.href = "/book/" + book.isbn)
                      }
                    >
                      <div className="flex flex-col gap-1">
                        <span className="text-lg font-bold text-gray-800">
                          {book.title}
                        </span>
                        <span className="text-sm text-gray-500">
                          ISBN: {book.isbn}
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-md font-medium text-indigo-600">
                          {book.quantity} available
                        </span>
                        <span className="text-xs text-gray-500 italic">
                          {book.quantity > 0 ? "In stock" : "Out of stock"}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-sm text-gray-800 text-center">
                    No books found
                  </div>
                )}
              </div>
            </div>
          )}
          {currentSection === "add-book" && (
            <div className="mt-4 flex flex-col gap-2">
              <div
                className={`border p-2 rounded-lg text-sm text-center font-semibold ${
                  addBookResponse === ""
                    ? "hidden"
                    : addBookResponse === "Book added successfully" ||
                      addBookResponse === "Book quantity updated successfully"
                    ? "bg-green-50 text-green-500 border-green-500"
                    : "bg-red-50 text-red-500 border-red-500"
                }`}
              >
                {addBookResponse}
              </div>
              <label className="text-sm font-semibold">ISBN</label>
              <input
                type="text"
                id="isbn"
                value={newBook.isbn}
                onChange={handleNewBookDetails}
                placeholder="ISBN"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm placeholder-gray-500"
              />
              <label className="text-sm font-semibold">Genres</label>
              <div className="relative">
                <div
                  type="text"
                  className={`w-full flex flex-wrap gap-2 px-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm placeholder-gray-500 ${
                    genresVisible ? "rounded-t-lg" : "rounded-lg"
                  }`}
                >
                  {newBook.genres.map((genre, index) => (
                    <div
                      key={index}
                      className="flex items-center bg-gray-100 border border-gray-300 rounded-full px-3 py-1 text-sm font-medium text-gray-700"
                    >
                      <span>{genre}</span>
                      <button
                        className="ml-2 bg-gray-700 text-white rounded-full p-1 flex items-center justify-center w-5 h-5 hover:bg-black transition duration-200"
                        onClick={() =>
                          setNewBook({
                            ...newBook,
                            genres: newBook.genres.filter((g) => g !== genre),
                          })
                        }
                      >
                        &times;
                      </button>
                    </div>
                  ))}
                  <input
                    id="searchText"
                    className="text-sm placeholder-gray-500 focus:outline-none"
                    placeholder="Search for a genre..."
                    value={newBook.searchText}
                    onChange={handleNewBookDetails}
                    onFocus={() => setGenresVisible(true)}
                  />
                </div>
                <div
                  className={`absolute w-full z-50 bg-white max-h-48 overflow-auto border border-gray-300 rounded-b-lg shadow-lg ${
                    !genresVisible && "hidden"
                  }`}
                  ref={(node) => (genresRef.current = node)}
                >
                  {filteredGenres.length === 0 ? (
                    <div className="text-sm text-gray-500 p-3">
                      No genres found
                    </div>
                  ) : (
                    filteredGenres.map((genre) => (
                      <div
                        key={genre}
                        className={`p-3 text-sm text-gray-700 cursor-pointer border-b border-gray-200 hover:bg-gray-100 transition ${
                          newBook.genres.includes(genre) &&
                          "bg-gray-200 font-semibold"
                        }`}
                        onClick={() => {
                          setNewBook({
                            ...newBook,
                            genres: newBook.genres.includes(genre)
                              ? newBook.genres.filter((g) => g !== genre)
                              : [...newBook.genres, genre],
                          });
                          document.getElementById("searchText").focus();
                        }}
                      >
                        {genre}
                      </div>
                    ))
                  )}
                </div>
              </div>
              <label className="text-sm font-semibold">Quantity</label>
              <input
                type="number"
                min={0}
                id="quantity"
                value={newBook.quantity}
                onChange={handleNewBookDetails}
                placeholder="Quantity"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm placeholder-gray-500"
              />
              <button
                className={`bg-gray-900 text-white text-sm font-semibold text-center py-2 px-4 rounded-lg border ${
                  addingBook && "opacity-50 cursor-not-allowed"
                }`}
                disabled={addingBook}
                onClick={handleAddBook}
              >
                {addingBook ? "Adding..." : "Add Book"}
              </button>
            </div>
          )}
        </div>
        <div className="bg-white p-6 border border-gray-300 rounded-lg mt-8">
          <h1 className="text-lg text-gray-800 font-semibold hover:underline hover:text-blue-500 duration-150 hover:cursor-pointer">
            Recent Activities
          </h1>
          <div className="flex flex-col gap-4 mt-4 max-h-48 overflow-auto">
            {activity.length > 0 ? (
              activity.map((act, index) => (
                <div
                  key={index}
                  className="flex flex-col md:flex-row items-start md:items-center justify-between gap-2 bg-white border border-gray-200 rounded-lg p-4 shadow-sm"
                >
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-800 font-medium">
                      {act.email}
                    </span>
                    <span className="text-sm text-gray-600">
                      {act.activity}
                    </span>
                  </div>
                  <span className="text-xs text-gray-500 md:text-right">
                    {dateFormatter.format(new Date(act.activityOn))}
                  </span>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-600">
                <p className="text-sm">No activities found</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
