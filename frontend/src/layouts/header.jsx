import { useState } from "react";
import Logo from "../assets/logo.jpg";

export default function Header({ userDetails }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="flex justify-between items-center py-4 px-6 lg:px-12 bg-white shadow-sm sticky top-0 z-50">
      {/* Logo Section */}
      <div className="flex items-center text-2xl font-bold text-gray-800">
        <img src={Logo} alt="Vachanika Logo" className="h-10 w-10 mr-2" />
        <a href="/" className="hover:text-indigo-600 transition duration-300">
          Vachanika
        </a>
      </div>

      {/* Navigation for Large Screens */}
      <nav className="hidden lg:flex lg:items-center space-x-6 text-gray-700 text-md font-medium">
        <a
          href="/browse"
          className="hover:text-indigo-600 transition duration-300"
        >
          Browse Books
        </a>
        <a
          href="#wishlist"
          className="hover:text-indigo-600 transition duration-300"
        >
          My Wishlist
        </a>
        <a
          href="#borrow-history"
          className="hover:text-indigo-600 transition duration-300"
        >
          Borrow History
        </a>
        <a
          href="/manage-books"
          className="hover:text-indigo-600 transition duration-300"
        >
          For Librarians
        </a>
        {userDetails?.name ? (
          <a
            href="/user/profile"
            className="hover:text-indigo-600 transition duration-300"
          >
            Profile
          </a>
        ) : (
          <a
            href="/signin"
            className="hover:text-indigo-600 transition duration-300"
          >
            Sign In
          </a>
        )}
      </nav>

      {/* Hamburger Menu for Small Screens */}
      <div className="lg:hidden">
        <button
          className="text-gray-700 focus:outline-none"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
            />
          </svg>
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <nav className="absolute top-16 left-0 w-full bg-white shadow-lg py-4 lg:hidden">
          <ul className="flex flex-col space-y-4 text-gray-700 text-md font-medium px-6">
            <li>
              <a
                href="#browse"
                className="block hover:text-indigo-600 transition duration-300"
              >
                Browse Books
              </a>
            </li>
            <li>
              <a
                href="#wishlist"
                className="block hover:text-indigo-600 transition duration-300"
              >
                My Wishlist
              </a>
            </li>
            <li>
              <a
                href="#borrow-history"
                className="block hover:text-indigo-600 transition duration-300"
              >
                Borrow History
              </a>
            </li>
            <li>
              <a
                href="#librarian"
                className="block hover:text-indigo-600 transition duration-300"
              >
                For Librarians
              </a>
            </li>
            <li>
              {userDetails?.name ? (
                <a
                  href="/user/profile"
                  className="block hover:text-indigo-600 transition duration-300"
                >
                  Profile
                </a>
              ) : (
                <a
                  href="/signin"
                  className="block hover:text-indigo-600 transition duration-300"
                >
                  Sign In
                </a>
              )}
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
