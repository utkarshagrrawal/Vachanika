import axios from "axios";
import { useEffect, useRef, useState } from "react";
import StarIcon from "../components/icons/starIcon";

function debounce(fn, delay) {
  let timer;
  return function (...args) {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

export default function BorrowHistory() {
  const dateFormatter = new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
  });

  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const [pastBorrows, setPastBorrows] = useState([]);
  const [page, setPage] = useState(1);
  const [response, setResponse] = useState({
    message: "",
    type: "",
  });
  const [processing, setProcessing] = useState(false);
  const [selectedSection, setSelectedSection] = useState("");
  const [returningBookDetails, setReturningBookDetails] = useState({
    isbn: "",
    review: "",
    rating: "",
  });
  const [reviewPrompt, setReviewPrompt] = useState(false);
  const scrollRef = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.scrollY > scrollRef.current &&
        window.scrollY + window.innerHeight >=
          document.documentElement.scrollHeight
      ) {
        scrollRef.current = window.scrollY;
        setPage(page + 1);
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
      .then((res) => {
        setSelectedSection("current");
      })
      .catch((err) => {
        if (err.code !== "ECONNABORTED") {
          window.location.href =
            "/signin?next=" + encodeURIComponent(window.location.pathname);
        }
      });
  }, []);

  useEffect(() => {
    const fetchBorrowedBooks = () => {
      axios
        .get(import.meta.env.VITE_API_URL + "/api/v1/user/borrowed-books", {
          withCredentials: true,
        })
        .then((res) => {
          setBorrowedBooks(res.data || []);
        })
        .catch((err) => {
          setResponse({
            message:
              err.response?.data || "An error occurred while fetching books",
            type: "error",
          });
        });
    };
    if (selectedSection === "current") {
      fetchBorrowedBooks();
    }
  }, [selectedSection]);

  useEffect(() => {
    const fetchPastBorrows = () => {
      axios
        .get(
          import.meta.env.VITE_API_URL +
            "/api/v1/library/past-borrows?page=" +
            page,
          {
            withCredentials: true,
          }
        )
        .then((res) => {
          setPastBorrows(res.data || []);
        })
        .catch((err) => {
          setResponse({
            message:
              err.response?.data ||
              "An error occurred while fetching past borrows",
            type: "error",
          });
        });
    };
    if (selectedSection === "past") {
      fetchPastBorrows();
    }
  }, [selectedSection, page]);

  const handleReturn = (book) => {
    setProcessing(true);
    setReviewPrompt(false);

    axios
      .post(
        import.meta.env.VITE_API_URL + "/api/v1/library/return-book",
        {
          isbn: returningBookDetails.isbn,
          review: returningBookDetails.review.substring(0, 500),
          rating: parseInt(returningBookDetails.rating),
        },
        {
          withCredentials: true,
        }
      )
      .then((res) => {
        setResponse({
          message: res.data,
          type: "success",
        });
        setBorrowedBooks(
          borrowedBooks.filter((b) => b.isbn !== returningBookDetails.isbn)
        );
      })
      .catch((err) => {
        setResponse({
          message:
            err.response?.data || "An error occurred while returning book",
          type: "error",
        });
      })
      .finally(() => {
        setProcessing(false);
      });
  };

  const handleRenew = (book) => {
    setProcessing(true);

    axios
      .post(
        import.meta.env.VITE_API_URL + "/api/v1/library/extend-due-date",
        {
          isbn: book.isbn,
        },
        {
          withCredentials: true,
        }
      )
      .then((res) => {
        setBorrowedBooks(
          borrowedBooks.map((b) =>
            b.isbn === book.isbn
              ? {
                  ...b,
                  returnDate: new Date(
                    new Date(b.returnDate).getTime() + 7 * 24 * 60 * 60 * 1000
                  ),
                }
              : b
          )
        );
        setResponse({
          message: res.data,
          type: "success",
        });
      })
      .catch((err) => {
        setResponse({
          message:
            err.response?.data || "An error occurred while extending due date",
          type: "error",
        });
      })
      .finally(() => {
        setProcessing(false);
      });
  };

  const handleReportLost = (book) => {
    setProcessing(true);

    axios
      .post(
        import.meta.env.VITE_API_URL + "/api/v1/library/lost-book",
        {
          isbn: book.isbn,
        },
        {
          withCredentials: true,
        }
      )
      .then((res) => {
        setBorrowedBooks(borrowedBooks.map((b) => b.isbn !== book.isbn));
        console.log(pastBorrows);
        setPastBorrows([
          ...pastBorrows,
          { ...book, lost: true, returnDate: new Date().toISOString() },
        ]);
        setResponse({
          message: res.data,
          type: "success",
        });
      })
      .catch((err) => {
        setResponse({
          message:
            err.response?.data || "An error occurred while reporting lost",
          type: "error",
        });
      })
      .finally(() => {
        setProcessing(false);
      });
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8">
      <div
        className={`flex justify-center items-center fixed inset-0 backdrop-blur-md z-50 ${
          !reviewPrompt && "hidden"
        }`}
      >
        <div className="flex flex-col bg-white p-6 border border-gray-200 rounded-lg shadow-md w-full max-w-md">
          <h3 className="text-lg font-bold text-gray-800 mb-4 text-center">
            Rate & Review the Book
          </h3>
          <div className="flex items-center justify-center gap-1 mb-4">
            {[...Array(5)].map((_, index) => (
              <button
                key={index}
                onClick={() =>
                  setReturningBookDetails((prev) => ({
                    ...prev,
                    rating: index + 1,
                  }))
                }
              >
                <StarIcon
                  className={`size-8 transition-colors duration-200 ${
                    returningBookDetails.rating > index
                      ? "text-yellow-500"
                      : "text-gray-300"
                  }`}
                  fill={
                    returningBookDetails.rating > index
                      ? "currentColor"
                      : "none"
                  }
                />
              </button>
            ))}
          </div>
          <textarea
            placeholder="Write your review here..."
            className="w-full h-28 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-600 focus:border-gray-600 text-sm placeholder-gray-400 resize-none mb-4"
            value={returningBookDetails.review}
            onChange={(e) =>
              setReturningBookDetails((prev) => ({
                ...prev,
                review: e.target.value,
              }))
            }
          ></textarea>
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-500">
              We appreciate your honest feedback!
            </span>
            <button
              className="bg-black text-white py-2 px-6 rounded-lg hover:bg-gray-800 transition duration-300 text-sm"
              onClick={handleReturn}
            >
              Submit
            </button>
            <button
              className="text-gray-500 hover:text-gray-800"
              onClick={() => {
                setReviewPrompt(false);
                setReturningBookDetails({
                  isbn: "",
                  review: "",
                  rating: "",
                });
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
      <div className="max-w-4xl bg-white container mx-auto p-8 space-y-4 border rounded-lg">
        <h1 className="text-3xl font-semibold">Your Borrow History</h1>
        <h5 className="text-sm text-gray-600">
          View and manage your borrowed books
        </h5>
        {response.message && (
          <div
            className={`text-center p-2 text-sm font-semibold rounded-lg border ${
              response.type === "success"
                ? "bg-green-100 text-green-700 border-green-200"
                : "bg-red-100 text-red-700 border-red-200"
            }`}
          >
            {response.message}
          </div>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-gray-100 border rounded-md p-1">
          <div
            className={`text-center text-sm p-1 transition-colors duration-100 hover:cursor-pointer rounded-md ${
              selectedSection === "current" && "bg-white font-semibold"
            }`}
            onClick={() => setSelectedSection("current")}
          >
            Current Borrows
          </div>
          <div
            className={`text-center text-sm p-1 transition-colors duration-100 hover:cursor-pointer rounded-md ${
              selectedSection === "past" && "bg-white font-semibold"
            }`}
            onClick={() => setSelectedSection("past")}
          >
            Past Borrows
          </div>
        </div>
        {selectedSection === "current" && (
          <div className="flex flex-col gap-4">
            {borrowedBooks.length === 0 ? (
              <p className="text-center text-gray-600">
                No books borrowed currently
              </p>
            ) : (
              borrowedBooks.map((book, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between bg-white border border-gray-200 rounded-lg p-4"
                >
                  <div className="flex items-center">
                    <img
                      src={`https://covers.openlibrary.org/b/isbn/${book.isbn}-M.jpg`}
                      alt="Book cover"
                      className="w-32 h-32 object-contain rounded-lg"
                    />
                    <div className="flex flex-col justify-center gap-1">
                      <h3 className="text-xl font-semibold text-gray-800">
                        {book.title}
                      </h3>
                      <h4 className="text-md text-gray-600">{book.author}</h4>
                      <span className="flex items-center gap-2 text-sm text-gray-600">
                        <span
                          className={
                            new Date(book.returnDate) < new Date()
                              ? "bg-red-500 text-white text-xs font-semibold py-1 px-3 rounded-full"
                              : "hidden"
                          }
                        >
                          Overdue
                        </span>
                        Due on {dateFormatter.format(new Date(book.returnDate))}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col justify-center gap-2">
                    <button
                      className={`bg-white border border-gray-200 text-sm font-semibold p-2 rounded-lg hover:bg-black hover:text-white transition-colors duration-150 ${
                        processing && "cursor-not-allowed opacity-50"
                      }`}
                      disabled={processing}
                      onClick={() => {
                        setReviewPrompt(true);
                        setReturningBookDetails({
                          isbn: book.isbn,
                          review: "",
                          rating: "",
                        });
                      }}
                    >
                      Return
                    </button>
                    <button
                      className={`bg-white border border-gray-200 text-sm font-semibold p-2 rounded-lg hover:bg-black hover:text-white transition-colors duration-150 ${
                        processing && "cursor-not-allowed opacity-50"
                      }`}
                      disabled={processing}
                      onClick={() => handleRenew(book)}
                    >
                      Extend
                    </button>
                    <button
                      className={`bg-white border border-gray-200 text-sm font-semibold p-2 rounded-lg hover:bg-black hover:text-white transition-colors duration-150 ${
                        processing && "cursor-not-allowed opacity-50"
                      }`}
                      disabled={processing}
                      onClick={() => handleReportLost(book)}
                    >
                      Report Lost
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
        {selectedSection === "past" &&
          (pastBorrows.length === 0 ? (
            <p className="text-center text-gray-600">
              No books borrowed in the past
            </p>
          ) : (
            pastBorrows.map((book, index) => (
              <div
                key={index}
                className="flex items-center justify-between bg-white border border-gray-200 rounded-lg p-4"
              >
                <div className="flex items-center">
                  <img
                    src={`https://covers.openlibrary.org/b/isbn/${book.isbn}-M.jpg`}
                    alt="Book cover"
                    className="w-32 h-32 object-contain rounded-lg"
                  />
                  <div className="flex flex-col justify-center gap-1">
                    <h3 className="text-xl font-semibold text-gray-800">
                      {book.title}
                    </h3>
                    <h4 className="text-md text-gray-600">{book.author}</h4>
                    <span className="flex items-center gap-2 text-sm text-gray-600">
                      <span
                        className={`text-white text-xs font-semibold py-1 px-3 rounded-full ${
                          book.lost ? "bg-red-500" : "bg-green-500"
                        }`}
                      >
                        {book.lost ? "Reported Lost" : "Returned"}
                      </span>
                      on {dateFormatter.format(new Date(book.returnDate))}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col justify-center gap-2">
                  <button className="bg-white border border-gray-200 text-sm font-semibold p-2 rounded-lg">
                    Borrow Again
                  </button>
                </div>
              </div>
            ))
          ))}
      </div>
    </div>
  );
}
