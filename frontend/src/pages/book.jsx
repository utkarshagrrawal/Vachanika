import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import StarIcon from "../components/icons/starIcon";
import Header from "../layouts/header";

function debounce(fn, delay) {
  let timeout;
  return function (...args) {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), delay);
  };
}

export default function Book() {
  const { isbn } = useParams();
  const [userDetails, setUserDetails] = useState({});
  const [book, setBook] = useState({});
  const [reviews, setReviews] = useState([]);
  const [reviewsPage, setReviewsPage] = useState(1);
  const [processing, setProcessing] = useState(false);
  const [response, setResponse] = useState("");

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight
      )
        setReviewsPage(reviewsPage + 1);
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
        setUserDetails(res.data);
      })
      .catch((err) => {
        window.location.href =
          "/signin?next=" + encodeURIComponent("/book/" + isbn);
      });
  }, []);

  useEffect(() => {
    axios
      .get(import.meta.env.VITE_API_URL + "/api/v1/library/book/" + isbn, {
        withCredentials: true,
      })
      .then((res) => {
        setBook(res.data);
      })
      .catch((err) => {
        setResponse(
          err.response?.data || "An error occurred while fetching book details"
        );
      });
  }, []);

  useEffect(() => {
    axios
      .get(
        import.meta.env.VITE_API_URL +
          "/api/v1/library/reviews/" +
          isbn +
          "?page=" +
          reviewsPage,
        {
          withCredentials: true,
        }
      )
      .then((res) => {
        if (reviewsPage === 1) setReviews(res.data || []);
        else setReviews((prev) => [...prev, ...(res.data || [])]);
      })
      .catch((err) => {
        setResponse(
          err.response?.data || "An error occurred while fetching reviews"
        );
      });
  }, [reviewsPage]);

  const handleBorrow = () => {
    setProcessing(true);

    axios
      .post(
        import.meta.env.VITE_API_URL + "/api/v1/library/checkout-book",
        {
          isbn: book.isbn,
        },
        {
          withCredentials: true,
        }
      )
      .then((res) => {
        setResponse(res.data);
        setBook({
          ...book,
          quantity: book.quantity - 1,
        });
      })
      .catch((err) => {
        setResponse(
          err.response?.data || "An error occurred while borrowing book"
        );
      })
      .finally(() => {
        setProcessing(false);
      });
  };

  const handleAddToWishlist = () => {
    setProcessing(true);

    axios
      .post(
        import.meta.env.VITE_API_URL + "/api/v1/library/add-to-wishlist",
        {
          isbn: book.isbn,
        },
        {
          withCredentials: true,
        }
      )
      .then((res) => {
        setResponse(res.data);
      })
      .catch((err) => {
        setResponse(
          err.response?.data || "An error occurred while adding to wishlist"
        );
      })
      .finally(() => {
        setProcessing(false);
      });
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Header userDetails={userDetails} className={`bg-gray-50`} />
      <div className="w-full px-6 lg:px-12 py-8 space-y-6">
        {response && (
          <div
            className={`w-full border rounded-lg p-2 text-sm font-semibold text-center ${
              response === "Book checked out successfully" ||
              response === "Book added to wishlist successfully"
                ? "bg-green-100 border-green-300 text-green-700"
                : "bg-red-100 border-red-300 text-red-700"
            }`}
          >
            {response}
          </div>
        )}
        <div className="flex flex-col md:flex-row gap-8 px-8 md:px-0">
          <div className="w-1/3">
            <img
              src={`https://covers.openlibrary.org/b/isbn/${isbn}-L.jpg`}
              alt="Book cover"
              className="w-full h-full object-cover rounded-lg"
            />
          </div>
          <div className="md:w-2/3">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-800">{book.title}</h2>
              <span className="text-sm text-gray-600 border border-gray-500 rounded-lg px-2 py-1">
                {book.quantity > 0 ? "Available" : "Unavailable"}
              </span>
            </div>
            <h4 className="text-lg text-gray-600">by {book.author}</h4>
            <p className="mt-8 text-lg text-gray-600">
              <strong>ISBN:</strong> {book.isbn}
            </p>
            <p className="text-lg text-gray-600">
              <strong>Genre:</strong> {book.genre}
            </p>
            <div className="flex items-center gap-2 mt-4">
              <StarIcon className="w-6 h-6 text-yellow-400" />
              <p className="text-md text-gray-600">{book.rating || 0}</p>
            </div>
            {book.quantity > 0 && (
              <button
                className={`mt-4 bg-gray-800 text-white text-sm font-semibold p-2 rounded-lg ${
                  processing && "cursor-not-allowed opacity-50"
                }`}
                disabled={processing}
                onClick={handleBorrow}
              >
                Borrow Book
              </button>
            )}
            <button
              className={`mt-4 bg-gray-200 text-gray-800 text-sm font-semibold p-2 rounded-lg ml-2 ${
                processing && "opacity-50 cursor-not-allowed"
              }`}
              disabled={processing}
              onClick={handleAddToWishlist}
            >
              Add to Wishlist
            </button>
          </div>
        </div>
        <div className="w-full bg-white border border-gray-200 rounded-lg p-4 shadow-md">
          <h2 className="text-lg font-semibold text-gray-800 text-center">
            Reviews
          </h2>
          <div className="w-16 h-[2px] bg-gray-300 mx-auto my-2"></div>
          <p className="text-sm text-gray-600 text-center">
            Honest reviews help others make informed decisions. Only users who
            have borrowed this book can share their thoughts.
          </p>

          <div className="mt-4 flex flex-col space-y-4">
            {reviews.map((review, index) => (
              <div
                key={index}
                className="bg-gray-50 rounded-lg border border-gray-200 shadow-sm p-6 flex flex-col gap-4"
              >
                <p className="text-sm text-gray-700 leading-relaxed italic">
                  {review.review}
                </p>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-0">
                  {/* User Info */}
                  <div className="flex items-center gap-3">
                    <img
                      src="https://avatar.iran.liara.run/public/boy"
                      alt="Anonymous User"
                      className="h-10 w-10 rounded-full border border-gray-300"
                    />
                    <span className="text-sm text-gray-500">Anonymous</span>
                  </div>

                  {/* Rating Stars */}
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <StarIcon
                        key={i}
                        className={`w-5 h-5 ${
                          i < review.rating
                            ? "text-yellow-400"
                            : "text-gray-300"
                        }`}
                        fill="currentColor"
                      />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
