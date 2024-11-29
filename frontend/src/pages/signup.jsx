import { useState } from "react";
import axios from "axios";
import Logo from "../assets/logo.jpg";
import ShieldCheckIcon from "../components/icons/shieldCheckIcon";
import ShieldWarningIcon from "../components/icons/shieldWarningIcon";

export default function Signup() {
  const [signupData, setSignupData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    dob: "",
    gender: "",
    role: "user",
    terms: false,
  });
  const [score, setScore] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    setSignupData((prevData) => ({
      ...prevData,
      [e.target.name]:
        e.target.type === "checkbox" ? e.target.checked : e.target.value,
    }));
    if (e.target.name === "password") {
      const password = e.target.value;
      let tempScore = "";
      if (password.match(/[a-z]/)) tempScore += "L";
      if (password.match(/[A-Z]/)) tempScore += "U";
      if (password.match(/[0-9]/)) tempScore += "N";
      if (password.match(/[$&+,:;=?@#|'<>.^*()%!-]/)) tempScore += "S";
      if (password.length >= 12 && password.length <= 48) tempScore += "M";
      setScore(tempScore);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (signupData.password !== signupData.confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }
    if (score.length !== 5) {
      setErrorMessage("Password does not meet the requirements.");
      return;
    }
    if (!signupData.terms) {
      setErrorMessage("Please agree to the terms and conditions.");
      return;
    }

    setLoading(true);

    signupData.dob = new Date(signupData.dob).toISOString();
    signupData.role = "user";

    axios
      .post(import.meta.env.VITE_API_URL + "/api/v1/auth/signup", signupData, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        if (res.data === "User created successfully") {
          window.location.href = "/signin";
        }
      })
      .catch((err) => {
        setErrorMessage(
          err.response?.data || "An error occurred. Please try again."
        );
        setSignupData({
          ...signupData,
          dob: signupData.dob.split("T")[0],
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-50">
      <div className="w-full max-w-md p-8 bg-white shadow-lg rounded-lg">
        <h2 className="flex justify-center items-center gap-4 text-3xl font-bold text-gray-800 text-center mb-8">
          <img src={Logo} alt="Vachanika Logo" className="h-12 w-12" />
          Vachanika
        </h2>
        <div
          className={`text-center font-semibold border p-2 border-red-400 bg-red-100 rounded-lg text-red-600 text-sm mb-4 ${
            errorMessage === "" && "hidden"
          }`}
        >
          {errorMessage}
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name Field */}
          <div>
            <label
              htmlFor="name"
              className="block text-gray-700 text-sm font-semibold mb-2"
            >
              Full Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={signupData.name}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm placeholder-gray-400"
              placeholder="John Doe"
              required
            />
          </div>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <label className="block text-gray-700 text-sm font-semibold">
              Gender
            </label>
            <div className="flex items-center space-x-2">
              <div className="flex items-center gap-1">
                <input
                  type="radio"
                  id="male"
                  name="gender"
                  value="male"
                  onChange={handleChange}
                  className="h-4 w-4 border-gray-300 text-indigo-500 rounded focus:ring-2 focus:ring-indigo-500"
                  required
                />
                <label htmlFor="male" className="text-gray-600 text-sm">
                  Male
                </label>
              </div>
              <div className="flex items-center gap-1">
                <input
                  type="radio"
                  id="female"
                  name="gender"
                  value="female"
                  onChange={handleChange}
                  className="h-4 w-4 border-gray-300 text-indigo-500 rounded focus:ring-2 focus:ring-indigo-500"
                  required
                />
                <label htmlFor="female" className="text-gray-600 text-sm">
                  Female
                </label>
              </div>
              <div className="flex items-center gap-1">
                <input
                  type="radio"
                  id="other"
                  name="gender"
                  value="other"
                  onChange={handleChange}
                  className="h-4 w-4 border-gray-300 text-indigo-500 rounded focus:ring-2 focus:ring-indigo-500"
                  required
                />
                <label htmlFor="other" className="text-gray-600 text-sm">
                  Other
                </label>
              </div>
            </div>
          </div>

          <div>
            <label
              htmlFor="phone"
              className="block text-gray-700 text-sm font-semibold mb-2"
            >
              Phone
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={signupData.phone}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm placeholder-gray-400"
              placeholder="Enter your phone number"
              required
            />
          </div>

          <div>
            <label
              htmlFor="dob"
              className="block text-gray-700 text-sm font-semibold mb-2"
            >
              Date of Birth
            </label>
            <input
              type="date"
              id="dob"
              name="dob"
              value={signupData.dob}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm placeholder-gray-400"
              required
            />
          </div>

          {/* Email Field */}
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
              name="email"
              value={signupData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm placeholder-gray-400"
              placeholder="you@company.com"
              required
            />
          </div>

          {/* Password Field */}
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
              name="password"
              value={signupData.password}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm placeholder-gray-400"
              placeholder="Enter your password"
              required
            />
          </div>

          <ul
            className={`text-gray-600 text-sm space-y-1 ${
              score === "" && "hidden"
            }`}
          >
            <li className="flex">
              {score.includes("L") ? (
                <ShieldCheckIcon className="text-green-600 mr-2 size-6" />
              ) : (
                <ShieldWarningIcon className="text-red-600 mr-2 size-6" />
              )}
              Must contain at least one lowercase character
            </li>
            <li className="flex">
              {score.includes("U") ? (
                <ShieldCheckIcon className="text-green-600 mr-2 size-6" />
              ) : (
                <ShieldWarningIcon className="text-red-600 mr-2 size-6" />
              )}
              Must contain at least one uppercase character
            </li>
            <li className="flex">
              {score.includes("N") ? (
                <ShieldCheckIcon className="text-green-600 mr-2 size-6" />
              ) : (
                <ShieldWarningIcon className="text-red-600 mr-2 size-6" />
              )}
              Must contain at least one number
            </li>
            <li className="flex">
              {score.includes("S") ? (
                <ShieldCheckIcon className="text-green-600 mr-2 size-6" />
              ) : (
                <ShieldWarningIcon className="text-red-600 mr-2 size-6" />
              )}
              Must contain at least one special character
            </li>
            <li className="flex">
              {score.includes("M") ? (
                <ShieldCheckIcon className="text-green-600 mr-2 size-6" />
              ) : (
                <ShieldWarningIcon className="text-red-600 mr-2 size-6" />
              )}
              Must be between 12 and 48 characters
            </li>
          </ul>

          {/* Confirm Password Field */}
          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-gray-700 text-sm font-semibold mb-2"
            >
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={signupData.confirmPassword}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm placeholder-gray-400"
              placeholder="Confirm your password"
              required
            />
          </div>

          {/* Terms and Conditions */}
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="terms"
              name="terms"
              value={signupData.terms}
              onChange={handleChange}
              className="h-4 w-4 border-gray-300 text-indigo-500 rounded focus:ring-2 focus:ring-indigo-500"
              required
            />
            <label htmlFor="terms" className="text-gray-600 text-sm">
              I agree to the{" "}
              <a
                href="/terms-and-conditions"
                className="text-indigo-600 hover:underline"
              >
                Terms and Conditions
              </a>
            </label>
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              className={`w-full py-3 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200 ${
                loading && "opacity-50 cursor-not-allowed"
              }`}
              disabled={loading}
            >
              Sign Up
            </button>
          </div>
        </form>
        {/* Sign-In Navigation */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <a href="/signin" className="text-indigo-600 hover:underline">
              Sign In
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
