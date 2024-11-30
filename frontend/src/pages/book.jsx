import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import StarIcon from "../components/icons/starIcon";
import Header from "../layouts/header";

export default function Book() {
  const { isbn } = useParams();
  const [userDetails, setUserDetails] = useState({});
  const [book, setBook] = useState({});
  const [processing, setProcessing] = useState(false);
  const [response, setResponse] = useState("");

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

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Header userDetails={userDetails} className={`bg-gray-50`} />
      <div className="w-full px-6 lg:px-12 py-8 space-y-6">
        {response && (
          <div
            className={`w-full border rounded-lg p-2 text-sm font-semibold text-center ${
              response === "Book checked out successfully"
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
                {processing ? "Processing..." : "Borrow"}
              </button>
            )}
            <button
              className={`mt-4 bg-gray-200 text-gray-800 text-sm font-semibold p-2 rounded-lg ml-2 ${
                processing && "opacity-50 cursor-not-allowed"
              }`}
              disabled={processing}
            >
              Add to Wishlist
            </button>
          </div>
        </div>
        <div className="w-full bg-gray-50 border border-gray-300 rounded-md p-2 text-sm text-center font-semibold">
          Reviews
        </div>
      </div>
    </div>
  );
}
