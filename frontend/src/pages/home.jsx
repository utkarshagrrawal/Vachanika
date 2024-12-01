import { useEffect, useState } from "react";
import Footer from "../layouts/footer";
import Header from "../layouts/header";
import axios from "axios";

export default function Home() {
  const [userDetails, setUserDetails] = useState({});

  useEffect(() => {
    axios
      .get(import.meta.env.VITE_API_URL + "/api/v1/user/details", {
        withCredentials: true,
      })
      .then((res) => {
        setUserDetails(res.data || {});
      })
      .catch((err) => {
        console.error(
          err.response?.data || "An error occurred while fetching user details."
        );
      });
  }, []);

  return (
    <div className="min-h-screen">
      <Header className={"bg-white"} userDetails={userDetails} />

      <section className="text-center py-12 px-4 md:py-24 md:px-12">
        <h1 className="text-4xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-violet-500">
          Revolutionaize Your Library Experience
        </h1>
        <p className="text-center text-xl mb-6">
          Browse, Wishlist, and Borrow Books Seamlessly
        </p>
      </section>

      <section id="discover" className="py-12 px-4 md:py-24 md:px-12">
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

      <section id="features" className="p-12">
        <h2 className="text-4xl font-bold text-center text-gray-800 mb-16">
          What Our Users Say
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-12">
          <div className="bg-white rounded-lg border border-gray-200 p-8">
            <span className="italic">
              "Vachanika has revolutionized how we manage our library. It's
              intuitive, powerful, and has saved us countless hours."
            </span>
            <div className="flex items-center mt-4">
              <img
                src="https://avatar.iran.liara.run/public/boy"
                alt="User"
                className="h-12 w-12 rounded-full"
              />
              <div className="ml-4 flex flex-col">
                <span className="font-semibold">Jane Doe</span>
                <span className="text-gray-600">
                  Head Librarian, City central library
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-8">
            <span className="italic">
              "The real-time updates and easy-to-use interface have made
              managing our vast collection a breeze."
            </span>
            <div className="flex items-center mt-4">
              <img
                src="https://avatar.iran.liara.run/public/boy"
                alt="User"
                className="h-12 w-12 rounded-full"
              />
              <div className="ml-4 flex flex-col">
                <span className="font-semibold">Michael Chen</span>
                <span className="text-gray-600">
                  Librarian, University of Knowledge
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
