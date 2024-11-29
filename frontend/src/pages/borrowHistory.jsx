import axios from "axios";
import { useEffect, useRef, useState } from "react";

export default function BorrowHistory() {
  const dateFormatter = new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
  });

  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const [pastBorrows, setPastBorrows] = useState([]);
  const [page, setPage] = useState(1);
  const scrollValue = useRef(0);
  const [response, setResponse] = useState({
    message: "",
    type: "",
  });
  const [processing, setProcessing] = useState(false);
  const [selectedSection, setSelectedSection] = useState("current");

  useEffect(() => {
    const scrollListener = () => {
      if (window.scrollY - scrollValue.current > 100) {
        setPage(page + 1);
        scrollValue.current = window.scrollY;
      }
    };
    window.addEventListener("scroll", scrollListener);
    return () => window.removeEventListener("scroll", scrollListener);
  }, [selectedSection]);

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

    axios
      .post(
        import.meta.env.VITE_API_URL + "/api/v1/library/return-book",
        {
          isbn: book.isbn,
          returnDate: new Date().toISOString(),
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
        setBorrowedBooks(borrowedBooks.filter((b) => b.isbn !== book.isbn));
        setPastBorrows([...pastBorrows, book]);
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

  const handleRenew = (book) => {};

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8">
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
                            new Date(book.returnDate) > new Date()
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
                      onClick={() => handleReturn(book)}
                      disabled={processing}
                    >
                      Return
                    </button>
                    <button
                      className={`bg-white border border-gray-200 text-sm font-semibold p-2 rounded-lg hover:bg-black hover:text-white transition-colors duration-150 ${
                        processing && "cursor-not-allowed opacity-50"
                      }`}
                      disabled={processing}
                    >
                      Extend
                    </button>
                    <button
                      className={`bg-white border border-gray-200 text-sm font-semibold p-2 rounded-lg hover:bg-black hover:text-white transition-colors duration-150 ${
                        processing && "cursor-not-allowed opacity-50"
                      }`}
                      disabled={processing}
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
