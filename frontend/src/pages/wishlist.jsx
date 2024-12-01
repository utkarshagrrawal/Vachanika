import { useEffect, useRef, useState } from "react";
import HeartIcon from "../components/icons/heartIcon";
import axios from "axios";

function debounce(fn, delay) {
  let timer;
  return function (...args) {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

export default function Wishlist() {
  const [wishlist, setWishlist] = useState([]);
  const [response, setResponse] = useState({
    message: "",
    type: "",
  });
  const [wishlistPage, setWishlistPage] = useState(1);
  const [processing, setProcessing] = useState(false);
  const scrollRef = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.scrollY > scrollRef.current &&
        window.innerHeight + window.scrollY >=
          document.documentElement.scrollHeight
      ) {
        scrollRef.current = window.scrollY;
        setWishlistPage((prev) => prev + 1);
      }
    };
    const debouncedHandleScroll = debounce(handleScroll, 500);
    window.addEventListener("scroll", debouncedHandleScroll);
    return () => {
      window.removeEventListener("scroll", debouncedHandleScroll);
    };
  }, []);

  useEffect(() => {
    axios
      .get(import.meta.env.VITE_API_URL + "/api/v1/library/wishlist", {
        withCredentials: true,
      })
      .then((res) => {
        if (wishlistPage === 1) setWishlist(res.data || []);
        else setWishlist((prev) => [...prev, ...(res.data || [])]);
      })
      .catch((err) => {
        setResponse({
          message:
            err.response?.data || "An error occurred while fetching wishlist",
          type: "error",
        });
      });
  }, [wishlistPage]);

  const handleBorrow = (book) => {
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
        setWishlist((prev) => prev.filter((b) => b.isbn !== book.isbn));
        setResponse({
          message: res.data,
          type: "success",
        });
      })
      .catch((err) => {
        setResponse({
          message:
            err.response?.data || "An error occurred while borrowing the book",
          type: "error",
        });
      })
      .finally(() => {
        setProcessing(false);
      });
  };

  const handleRemove = (book) => {
    setProcessing(true);

    axios
      .post(
        import.meta.env.VITE_API_URL + "/api/v1/library/remove-from-wishlist",
        {
          isbn: book.isbn,
        },
        {
          withCredentials: true,
        }
      )
      .then((res) => {
        setWishlist((prev) => prev.filter((b) => b.isbn !== book.isbn));
        setResponse({
          message: res.data,
          type: "success",
        });
      })
      .catch((err) => {
        setResponse({
          message:
            err.response?.data ||
            "An error occurred while removing the book from wishlist",
          type: "error",
        });
      })
      .finally(() => {
        setProcessing(false);
      });
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-rose-100 via-white to-teal-100 py-8">
      <div className="bg-white container mx-auto p-4 md:p-6 rounded-lg border border-gray-200 shadow-md">
        <div className="flex items-center gap-2">
          <HeartIcon className="h-8 w-8 text-red-500" />
          <h1 className="text-3xl font-semibold text-gray-800">
            Your Wishlist
          </h1>
        </div>
        <span className="text-gray-500 text-sm">
          Manage your favorite books and reading lists
        </span>
        {response.message && (
          <div
            className={`w-full border rounded-lg p-2 my-2 text-sm font-semibold text-center ${
              response.type === "success"
                ? "bg-green-100 border-green-300 text-green-700"
                : "bg-red-100 border-red-300 text-red-700"
            }`}
          >
            {response.message}
          </div>
        )}
        <div className="mt-4 grid grid-cols-1 gap-4 place-content-center">
          {wishlist.map((book) => (
            <div
              key={book.isbn}
              className="flex flex-col md:flex-row items-center gap-6 p-6 bg-gray-50 border border-gray-200 rounded-lg shadow-md"
            >
              <img
                src={
                  "https://covers.openlibrary.org/b/isbn/" +
                  book.isbn +
                  "-M.jpg"
                }
                alt={book.title}
                className="h-40 w-28 rounded-lg object-cover border border-gray-300"
              />
              <div className="flex flex-col gap-3 w-full">
                <h2 className="text-lg font-bold text-gray-800">
                  {book.title}
                </h2>
                <p className="text-sm text-gray-500">
                  <span className="font-semibold text-gray-600">Author:</span>{" "}
                  {book.author}
                </p>
                <p className="text-sm text-gray-500">
                  <span className="font-semibold text-gray-600">ISBN:</span>{" "}
                  {book.isbn}
                </p>
              </div>
              <div className="flex flex-row md:flex-col w-full md:w-fit items-center gap-2">
                <button
                  className={`flex-1 bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition duration-300 text-sm ${
                    processing && "opacity-50 cursor-not-allowed"
                  }`}
                  onClick={() => handleRemove(book)}
                  disabled={processing}
                >
                  Remove
                </button>
                <button
                  className={`flex-1 bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition duration-300 text-sm ${
                    processing && "opacity-50 cursor-not-allowed"
                  }`}
                  onClick={() => handleBorrow(book)}
                  disabled={processing}
                >
                  Borrow
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
