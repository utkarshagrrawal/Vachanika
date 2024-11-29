import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import UserIcon from "../components/icons/userIcon";
import LockIcon from "../components/icons/lockIcon";
import BookIcon from "../components/icons/bookIcon";
import SettingsIcon from "../components/icons/settingsIcon";
import HeartIcon from "../components/icons/heartIcon";
import ShieldCheckIcon from "../components/icons/shieldCheckIcon";
import ShieldWarningIcon from "../components/icons/shieldWarningIcon";
import BookmarkIcon from "../components/icons/bookmarkIcon";
import ProfileAvatar from "../assets/avatar.jpg";

export default function UserProfile() {
  const dateFormatter = new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
  });

  const { area } = useParams();
  const [section, setSection] = useState(area || "personal");
  const [passwordUpdateMessage, setPasswordUpdateMessage] = useState("");
  const [passwords, setPasswords] = useState({
    current: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [score, setScore] = useState("");
  const [user, setUser] = useState({
    name: "",
    email: "",
    phone: "",
    gender: "",
    dob: "",
  });
  const [personalDetailsMessage, setPersonalDetailsMessage] = useState("");
  const [deletePromptVisible, setDeletePromptVisible] = useState(false);
  const [userDeleteResponse, setUserDeleteResponse] = useState("");

  useEffect(() => {
    axios
      .get(import.meta.env.VITE_API_URL + "/api/v1/user/details", {
        withCredentials: true,
      })
      .then((res) => {
        setUser(res.data);
        if (res.data.role === "admin") {
          window.location.href = "/admin/dashboard";
        }
      })
      .catch((err) => {
        console.error(
          err.response?.data || "An error occurred while fetching user details."
        );
      });
  }, []);

  const handleUserDetailsChange = (e) => {
    setUser((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
  };

  const handlePasswordChange = (e) => {
    setPasswords((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
    if (e.target.id === "newPassword") {
      const pass = e.target.value;
      let tempScore = "";
      if (pass.match(/[a-z]/)) tempScore += "L";
      if (pass.match(/[A-Z]/)) tempScore += "U";
      if (pass.match(/[0-9]/)) tempScore += "N";
      if (pass.match(/[$&+,:;=?@#|'<>.^*()%!-]/)) tempScore += "S";
      if (pass.length >= 12 && pass.length <= 48) tempScore += "M";
      setScore(tempScore);
    }
  };

  const handleUpdateUserDetails = (e) => {
    e.preventDefault();

    setPersonalDetailsMessage("");

    axios
      .put(import.meta.env.VITE_API_URL + "/api/v1/user/details", user, {
        withCredentials: true,
      })
      .then((res) => {
        if (res.data === "Profile updated successfully. Please login again.") {
          window.location.href =
            "/signin?next=" + encodeURIComponent("/user/profile/personal");
        } else {
          setPersonalDetailsMessage("Profile updated successfully");
        }
      })
      .catch((err) => {
        setPersonalDetailsMessage(
          err.response?.data || "An error occurred while updating profile."
        );
      });
  };

  const handlePasswordUpdate = (e) => {
    e.preventDefault();

    setPasswordUpdateMessage("");

    if (passwords.newPassword !== passwords.confirmPassword) {
      setPasswordUpdateMessage("Passwords do not match");
      return;
    }
    if (score.length !== 5) {
      setPasswordUpdateMessage("Password is not strong enough");
      return;
    }

    axios
      .put(
        import.meta.env.VITE_API_URL + "/api/v1/auth/change-password",
        {
          password: passwords.current,
          newPassword: passwords.newPassword,
        },
        {
          withCredentials: true,
        }
      )
      .then(() => {
        setPasswordUpdateMessage("Password changed successfully");
        setPasswords({
          current: "",
          newPassword: "",
          confirmPassword: "",
        });
        setScore("");
      })
      .catch((err) => {
        setPasswordUpdateMessage(
          err.response?.data || "An error occurred while changing password."
        );
      });
  };

  const handleDeleteAccount = () => {
    setUserDeleteResponse("");
    setDeletePromptVisible(false);

    axios
      .delete(import.meta.env.VITE_API_URL + "/api/v1/user/delete", {
        withCredentials: true,
      })
      .then((res) => {
        setUserDeleteResponse("Account deleted successfully");
        window.location.href = "/goodbye/" + encodeURIComponent(res.data);
      })
      .catch((err) => {
        setUserDeleteResponse(
          err.response?.data || "An error occurred while deleting account."
        );
      });
  };

  return (
    <div className="min-h-screen w-full container mx-auto p-4">
      <div
        className={`flex justify-center items-center absolute inset-0 min-h-screen backdrop-blur-md ${
          !deletePromptVisible && "hidden"
        }`}
      >
        <div className="w-full max-w-md p-8 bg-white border border-gray-500 shadow-lg rounded-lg">
          Deleting your account will remove all your data permanently. This
          action cannot be undone. You will not be able to recover your account
          after deletion.
          <div className="flex items-center">
            <button
              className="bg-black text-white py-2 px-4 rounded-md text-sm font-semibold mt-4 mr-4"
              onClick={() => setDeletePromptVisible(false)}
            >
              Cancel
            </button>
            <button
              className="bg-red-500 text-white py-2 px-4 rounded-md text-sm font-semibold mt-4"
              onClick={handleDeleteAccount}
            >
              Yes, Delete Account
            </button>
          </div>
        </div>
      </div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">User Profile</h1>
        <a
          href="/signout"
          className="bg-red-500 text-white py-2 px-4 rounded-md text-sm font-semibold"
        >
          Logout
        </a>
      </div>
      <nav className="flex flex-wrap lg:flex-nowrap gap-4 justify-between items-center w-full border bg-gray-50 rounded-md p-1">
        <div
          className={`flex-1 py-1 px-4 text-sm ${
            section === "personal" &&
            "bg-white shadow-md rounded-md font-semibold"
          }`}
          onClick={() => setSection("personal")}
        >
          <a
            href="/user/profile/personal"
            className="flex justify-center items-center gap-2"
          >
            <UserIcon className="h-6 w-6" />
            Personal
          </a>
        </div>
        <div
          className={`flex-1 py-1 px-4 text-sm ${
            section === "security" &&
            "bg-white shadow-md rounded-md font-semibold"
          }`}
          onClick={() => setSection("security")}
        >
          <a
            href="/user/profile/security"
            className="flex justify-center items-center gap-2"
          >
            <LockIcon className="h-6 w-6" />
            Security
          </a>
        </div>
        <div
          className={`flex-1 py-1 px-4 text-sm ${
            section === "settings" &&
            "bg-white shadow-md rounded-md font-semibold"
          }`}
          onClick={() => setSection("settings")}
        >
          <a
            href="/user/profile/settings"
            className="flex justify-center items-center gap-2"
          >
            <SettingsIcon className="h-6 w-6" />
            Settings
          </a>
        </div>
      </nav>
      {section === "personal" && (
        <div className="w-full border mt-4 p-4 rounded-md">
          <h2 className="text-xl font-bold">Personal Information</h2>
          <span className="text-gray-500 text-sm">
            Manage your personal information, such as display name, email, and
            contact details.
          </span>
          <div
            className={`mt-4 p-2 border rounded-lg text-sm font-semibold text-center ${
              personalDetailsMessage === ""
                ? "hidden"
                : personalDetailsMessage === "Profile updated successfully"
                ? "bg-green-50 text-green-500 border-green-500"
                : "bg-red-50 text-red-500 border-red-500"
            }`}
          >
            {personalDetailsMessage}
          </div>
          <img
            src={ProfileAvatar}
            alt="Profile"
            className="size-16 rounded-full mix-blend-multiply"
          />
          <form onSubmit={handleUpdateUserDetails} className="mt-4 space-y-4">
            <div className="flex flex-col">
              <label htmlFor="name" className="text-sm font-semibold">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                value={user.name}
                onChange={handleUserDetailsChange}
                className="border rounded-md p-2 mt-2 text-sm"
                placeholder="John Doe"
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="email" className="text-sm font-semibold">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={user.email}
                onChange={handleUserDetailsChange}
                className="border rounded-md p-2 mt-2 text-sm"
                placeholder="you@example.com"
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="phone" className="text-sm font-semibold">
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                value={user.phone}
                onChange={handleUserDetailsChange}
                className="border rounded-md p-2 mt-2 text-sm"
                placeholder="+91 12345 67890"
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="gender" className="text-sm font-semibold">
                Gender
              </label>
              <select
                id="gender"
                value={user.gender}
                onChange={handleUserDetailsChange}
                className="border rounded-md p-2 mt-2 text-sm"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="flex flex-col">
              <label htmlFor="dob" className="text-sm font-semibold">
                Date of Birth
              </label>
              <input
                type="date"
                id="dob"
                value={user.dob?.split("T")[0]}
                onChange={handleUserDetailsChange}
                className="border rounded-md p-2 mt-2 text-sm"
              />
            </div>

            <button className="bg-black text-white py-2 px-4 rounded-md text-sm">
              Save Changes
            </button>
          </form>
        </div>
      )}
      {section === "security" && (
        <div className="border rounded-md mt-4 p-4">
          <h2 className="text-xl font-bold">Security Settings</h2>
          <span className="text-gray-500 text-sm">
            Manage your account security settings
          </span>
          <div
            className={`mt-4 p-2 border rounded-lg text-sm font-semibold text-center ${
              passwordUpdateMessage === ""
                ? "hidden"
                : passwordUpdateMessage === "Password changed successfully"
                ? "bg-green-50 border-green-500 text-green-500"
                : "border-red-500 bg-red-50 text-red-500"
            } rounded-md`}
          >
            {passwordUpdateMessage}
          </div>
          <form onSubmit={handlePasswordUpdate} className="mt-4 space-y-4">
            <div className="flex flex-col">
              <label htmlFor="password" className="text-sm font-semibold">
                Current Password
              </label>
              <input
                type="password"
                id="current"
                value={passwords.current}
                onChange={handlePasswordChange}
                className="border rounded-md p-2 mt-2 text-sm"
                placeholder="Enter your current password"
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="newPassword" className="text-sm font-semibold">
                New Password
              </label>
              <input
                type="password"
                id="newPassword"
                value={passwords.newPassword}
                onChange={handlePasswordChange}
                className="border rounded-md p-2 mt-2 text-sm"
                placeholder="Enter your new password"
              />
            </div>
            <ul
              className={`space-y-1 text-sm text-gray-500 ${
                score === "" && "hidden"
              }`}
            >
              <li className="flex gap-2 items-center">
                {score.includes("L") ? (
                  <ShieldCheckIcon className="h-4 w-4 text-green-500" />
                ) : (
                  <ShieldWarningIcon className="h-4 w-4 text-red-500" />
                )}{" "}
                At least one lowercase letter
              </li>
              <li className="flex gap-2 items-center">
                {score.includes("U") ? (
                  <ShieldCheckIcon className="h-4 w-4 text-green-500" />
                ) : (
                  <ShieldWarningIcon className="h-4 w-4 text-red-500" />
                )}{" "}
                At least one uppercase letter
              </li>
              <li className="flex gap-2 items-center">
                {score.includes("N") ? (
                  <ShieldCheckIcon className="h-4 w-4 text-green-500" />
                ) : (
                  <ShieldWarningIcon className="h-4 w-4 text-red-500" />
                )}{" "}
                At least one number
              </li>
              <li className="flex gap-2 items-center">
                {score.includes("S") ? (
                  <ShieldCheckIcon className="h-4 w-4 text-green-500" />
                ) : (
                  <ShieldWarningIcon className="h-4 w-4 text-red-500" />
                )}{" "}
                At least one special character
              </li>
              <li className="flex gap-2 items-center">
                {score.includes("M") ? (
                  <ShieldCheckIcon className="h-4 w-4 text-green-500" />
                ) : (
                  <ShieldWarningIcon className="h-4 w-4 text-red-500" />
                )}{" "}
                Must be 12-48 characters long
              </li>
            </ul>
            <div className="flex flex-col">
              <label
                htmlFor="confirmPassword"
                className="text-sm font-semibold"
              >
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                value={passwords.confirmPassword}
                onChange={handlePasswordChange}
                className="border rounded-md p-2 mt-2 text-sm"
                placeholder="Confirm your new password"
              />
            </div>
            <button className="bg-black text-white py-2 px-4 rounded-md text-sm">
              Change Password
            </button>
          </form>
        </div>
      )}
      {section === "settings" && (
        <div className="mt-4 p-4 border rounded-md">
          <h2 className="text-xl font-bold">Account settings</h2>
          <span className="text-gray-500 text-sm">
            Manage your account preferences
          </span>
          <div
            className={`mt-4 p-2 border rounded-lg text-sm font-semibold text-center ${
              userDeleteResponse === ""
                ? "hidden"
                : userDeleteResponse === "Account deleted successfully"
                ? "bg-green-50 border-green-500 text-green-500"
                : "border-red-500 bg-red-50 text-red-500"
            } rounded-md`}
          >
            {userDeleteResponse}
          </div>
          <div className="mt-4 space-y-4">
            <button
              className="border bg-red-500 text-white py-2 px-4 rounded-md text-sm font-semibold"
              onClick={() => setDeletePromptVisible(true)}
            >
              Delete Account
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
