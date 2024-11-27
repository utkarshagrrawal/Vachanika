import { useEffect, useState } from "react";
import LogoutIcon from "../components/icons/logoutIcon";
import axios from "axios";

export default function Signout() {
  const quotes = [
    "The library is the temple of learning, and learning has liberated more people than all the wars in history.",
    "A library is not a luxury but one of the necessities of life.",
    "The only thing that you absolutely have to know, is the location of the library.",
    "Libraries store the energy that fuels the imagination.",
    "I have always imagined that Paradise will be a kind of library.",
    "Libraries were full of ideas—perhaps the most dangerous and powerful of all weapons.",
    "A library is the delivery room for the birth of ideas, a place where history comes to life.",
    "A library is a hospital for the mind.",
    "A library is a place where you can feel safe.",
  ];
  const [quote, setQuote] = useState();
  const [redirectTime, setRedirectTime] = useState(15);

  useEffect(() => {
    setQuote(quotes[Math.floor(Math.random() * quotes.length)]);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setRedirectTime((prev) => {
        if (prev === 1) {
          window.location.href = "/";
          return 0;
        } else {
          return prev - 1;
        }
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    axios
      .post(
        import.meta.env.VITE_API_URL + "/api/v1/auth/signout",
        {},
        {
          withCredentials: true,
        }
      )
      .then(() => {})
      .catch(() => {});
  }, []);

  return (
    <div className="min-h-screen w-full flex justify-center items-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-lg bg-white container mx-auto p-4 md:p-8 border rounded-lg space-y-6 shadow-lg">
        <h3 className="text-2xl font-bold text-center text-gray-800">
          You have been signed out
        </h3>
        <LogoutIcon className="mx-auto w-16 h-16 text-gray-800" />
        <p className="text-md text-center text-gray-600">
          Thank you for using our library services. We hope to see you again
          soon!
        </p>
        <p className="text-md text-center text-gray-600 italic">"{quote}"</p>
        <h5 className="text-center text-sm text-gray-600">
          Redirecting to homepage in {redirectTime} seconds ...
        </h5>
        <button
          onClick={() => (window.location.href = "/signin")}
          className="text-center w-full bg-white hover:bg-black hover:text-white duration-200 border border-gray-200 font-semibold p-2 rounded-lg"
        >
          Sign in again
        </button>
      </div>
    </div>
  );
}
