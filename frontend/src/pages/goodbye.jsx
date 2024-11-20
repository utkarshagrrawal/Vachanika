import { useParams } from "react-router-dom";
import BookIcon from "../components/icons/bookIcon";
import HeartIcon from "../components/icons/heartIcon";
import InspireIcon from "../components/icons/inspireIcon";
import { useEffect } from "react";
import axios from "axios";

export default function Goodbye() {
  const { deletionToken } = useParams();
  const quotes = [
    "A reader lives a thousand lives before he dies. The man who never reads lives only one. - George R.R. Martin",
    "The more that you read, the more things you will know. The more that you learn, the more places you'll go. - Dr. Seuss",
    "A book is a dream that you hold in your hand. - Neil Gaiman",
    "There is no friend as loyal as a book. - Ernest Hemingway",
    "Reading is essential for those who seek to rise above the ordinary. - Jim Rohn",
    "Books are a uniquely portable magic. - Stephen King",
    "Until I feared I would lose it, I never loved to read. One does not love breathing. - Harper Lee",
    "The only thing that you absolutely have to know, is the location of the library. - Albert Einstein",
    "Reading gives us someplace to go when we have to stay where we are. - Mason Cooley",
    "A book is a gift you can open again and again. - Garrison Keillor",
  ];

  useEffect(() => {
    if (!deletionToken) {
      window.location.href = "/";
      return;
    }
    axios
      .get(
        import.meta.env.VITE_API_URL +
          "/api/v1/user/delete-verification/" +
          deletionToken
      )
      .then(() => {})
      .catch((err) => {
        window.location.href = "/";
      });
  }, []);

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <div className="bg-white w-full mx-16 px-8 space-y-6 p-8 max-w-2xl">
        <h1 className="text-3xl font-bold text-center text-gray-800 pb-2 border-b border-gray-200">
          We're Sorry to See You Go
        </h1>
        <p className="text-lg text-center text-gray-500">
          Your account has been successfully deleted. We hope you enjoyed your
          time with us.
        </p>
        <div className="flex justify-center items-center gap-4">
          <div className="text-center">
            <BookIcon className="w-16 h-16 text-gray-600" />
            Discover
          </div>
          <div className="text-center">
            <HeartIcon className="w-16 h-16 text-gray-600" />
            Love
          </div>
          <div className="text-center">
            <InspireIcon className="w-16 h-16 text-gray-600" />
            Inspire
          </div>
        </div>
        <div className="nimate-slideUp text-center italic text-gray-600 p-4 bg-gray-50 rounded-lg shadow-sm">
          {quotes[Math.floor(Math.random() * quotes.length)]}
        </div>
        <p className="text-center text-gray-500">
          If you change your mind, you're always welcome back.
        </p>
        <div
          className="flex justify-center"
          onClick={() => (window.location.href = "/")}
        >
          <button className="text-sm font-semibold text-center py-2 px-4 rounded border">
            Return to Home
          </button>
        </div>
      </div>
    </div>
  );
}
