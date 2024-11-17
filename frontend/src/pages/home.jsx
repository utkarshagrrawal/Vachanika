import { useEffect, useState } from "react";
import Footer from "../layouts/footer";
import Header from "../layouts/header";
import axios from "axios";

export default function Home() {
  const [userDetails, setUserDetails] = useState({});

  useEffect(() => {
    axios
      .get(import.meta.env.VITE_API_URL + "/api/v1/auth/user", {
        withCredentials: true,
      })
      .then((res) => {
        setUserDetails(res.data);
      })
      .catch((err) => {
        console.error(
          err.response?.data || "An error occurred while fetching user details."
        );
      });
  }, []);

  return (
    <div className="min-h-screen">
      <Header userDetails={userDetails} />

      <section className="text-center py-24 px-10">
        <h1 className="text-6xl font-extrabold mb-4">Welcome to Vachanika</h1>
        <p className="text-2xl mb-6">
          Browse, Wishlist, and Borrow Books Seamlessly
        </p>
      </section>

      <section id="discover" className="py-24 px-12">
        <h2 className="text-4xl font-bold text-center text-gray-800 mb-12">
          How Vachanika Works
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-12">
          <div className="bg-indigo-50 rounded-lg overflow-hidden p-8 text-center duration-300">
            <div className="text-indigo-600 text-5xl mb-6">📚</div>
            <h3 className="font-semibold text-xl text-gray-800 mb-4">
              Discover New Books
            </h3>
            <p className="text-gray-600 mb-4">
              Find and explore a wide variety of books across genres, authors,
              and new arrivals.
            </p>
            <a
              href="#browse"
              className="text-indigo-600 font-semibold hover:text-indigo-700 transition duration-300"
            >
              Start Discovering
            </a>
          </div>

          {/* Manage Wishlist */}
          <div className="bg-indigo-50 rounded-lg overflow-hidden p-8 text-center duration-300">
            <div className="text-indigo-600 text-5xl mb-6">💖</div>
            <h3 className="font-semibold text-xl text-gray-800 mb-4">
              Manage Your Wishlist
            </h3>
            <p className="text-gray-600 mb-4">
              Save your favorite books for later, create personalized reading
              lists, and keep track of your desired books.
            </p>
            <a
              href="#wishlist"
              className="text-indigo-600 font-semibold hover:text-indigo-700 transition duration-300"
            >
              Go to Wishlist
            </a>
          </div>

          {/* Borrow Books */}
          <div className="bg-indigo-50 rounded-lg overflow-hidden p-8 text-center duration-300">
            <div className="text-indigo-600 text-5xl mb-6">🛒</div>
            <h3 className="font-semibold text-xl text-gray-800 mb-4">
              Borrow Books
            </h3>
            <p className="text-gray-600 mb-4">
              Borrow your selected books and enjoy reading at your own pace,
              with easy tracking of borrowed items.
            </p>
            <a
              href="#borrow-history"
              className="text-indigo-600 font-semibold hover:text-indigo-700 transition duration-300"
            >
              Borrow Now
            </a>
          </div>
        </div>
      </section>

      <section id="features" className="py-24 px-12 bg-indigo-50">
        <h2 className="text-4xl font-bold text-center text-gray-800 mb-16">
          Our Library Features
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-12">
          {/* Feature 1: Easy Navigation */}
          <div className="bg-white rounded-lg overflow-hidden p-8 text-center duration-300">
            <div className="text-indigo-600 text-5xl mb-6">🔍</div>
            <h3 className="font-semibold text-xl text-gray-800 mb-4">
              Easy Navigation
            </h3>
            <p className="text-gray-600 mb-4">
              Quickly find books, manage your wishlist, and track your borrowed
              items with a seamless interface.
            </p>
          </div>

          {/* Feature 3: Track Borrow History */}
          <div className="bg-white rounded-lg overflow-hidden p-8 text-center duration-300">
            <div className="text-indigo-600 text-5xl mb-6">📜</div>
            <h3 className="font-semibold text-xl text-gray-800 mb-4">
              Track Borrow History
            </h3>
            <p className="text-gray-600 mb-4">
              Easily view your borrowing history, including the books you've
              read and the ones you have borrowed currently.
            </p>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
