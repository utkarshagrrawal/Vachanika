import { useEffect, useState } from "react";
import axios from "axios";
import Logo from "../assets/logo.jpg";

export default function Signin() {
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const params = new URLSearchParams(window.location.search);

  useEffect(() => {
    setLoading(true);

    axios
      .get(import.meta.env.VITE_API_URL + "/api/v1/user/details", {
        withCredentials: true,
      })
      .then((res) => {
        if (res.data?.name) {
          if (params.get("next")) {
            window.location.href = decodeURIComponent(params.get("next"));
          } else {
            window.location.href = "/";
          }
        }
      })
      .catch((err) => {})
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleChange = (e) => {
    setLoginData({
      ...loginData,
      [e.target.id]:
        e.target.type === "checkbox" ? e.target.checked : e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    setLoading(true);

    axios
      .post(import.meta.env.VITE_API_URL + "/api/v1/auth/signin", loginData, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        if (res.data === "Login successfull") {
          if (params.get("next")) {
            window.location.href = decodeURIComponent(params.get("next"));
          } else {
            window.location.href = "/";
          }
        } else {
          setErrorMessage(res.data || "An error occurred. Please try again.");
        }
      })
      .catch((err) => {
        setErrorMessage(
          err.response?.data || "An error occurred. Please try again."
        );
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="h-screen flex justify-center items-center bg-gray-50">
      <div className="w-full max-w-md p-8 bg-white shadow-lg rounded-lg">
        <h2 className="flex justify-center items-center gap-4 text-3xl font-bold text-gray-800 text-center mb-8">
          <img src={Logo} alt="Vachanika Logo" className="h-12 w-12" />
          Vachanika
        </h2>

        <div
          className={`text-center border p-2 font-semibold border-red-400 bg-red-100 rounded-lg text-red-600 text-sm mb-4 ${
            errorMessage === "" && "hidden"
          }`}
        >
          {errorMessage}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-gray-700 text-sm font-semibold mb-2"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={loginData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm placeholder-gray-400"
              placeholder="you@company.com"
              autoFocus
              required
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-gray-700 text-sm font-semibold mb-2"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={loginData.password}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm placeholder-gray-400"
              placeholder="Enter your password"
              required
            />
          </div>

          {/* Remember Me */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="rememberMe"
              checked={loginData.rememberMe}
              onChange={handleChange}
              className="h-4 w-4 border-gray-300 text-indigo-500 rounded focus:ring-2 focus:ring-indigo-500"
            />
            <label htmlFor="rememberMe" className="text-gray-600 text-sm ml-2">
              Remember Me
            </label>
          </div>

          <div>
            <button
              type="submit"
              className={`w-full py-3 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200 ${
                loading && "opacity-50 cursor-not-allowed"
              }`}
              disabled={loading}
            >
              {loading ? "Signing In..." : "Sign In"}
            </button>
          </div>
        </form>

        <div className="text-center mt-6">
          <p className="text-sm text-gray-600">
            Don't have an account?{" "}
            <a href="/signup" className="text-indigo-600 hover:underline">
              Sign Up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
