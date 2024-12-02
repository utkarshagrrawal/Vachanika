import { useEffect, useState } from "react";
import axios from "axios";

export default function AdminProfile() {
  const [user, setUser] = useState({});
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState({});
  const [response, setResponse] = useState({
    message: "",
    type: "",
  });
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    axios
      .get(import.meta.env.VITE_API_URL + "/api/v1/user/details", {
        withCredentials: true,
      })
      .then((res) => {
        if (res.data.role !== "admin") {
          window.location.href = "/";
        }
        setUser(res.data);
      })
      .catch((err) => {
        if (err.code !== "ECONNABORTED") {
          window.location.href =
            "/signin?next=" + encodeURIComponent("/admin/dashboard");
        }
      });
  }, []);

  useEffect(() => {
    const fetchUsers = () => {
      axios
        .get(import.meta.env.VITE_API_URL + "/api/v1/admin/users", {
          withCredentials: true,
        })
        .then((res) => {
          setUsers(res.data || []);
        })
        .catch((err) => {});
    };
    if (user.role === "admin") {
      fetchUsers();
    }
  }, [user]);

  const handleRoleUpdate = () => {
    setProcessing(true);

    axios
      .put(
        import.meta.env.VITE_API_URL + "/api/v1/admin/users",
        {
          email: selectedUser.email,
          role: selectedUser.role,
        },
        {
          withCredentials: true,
        }
      )
      .then((res) => {
        setResponse({
          message: res.data,
          type: "success",
        });
        setUsers((prev) =>
          prev.map((user) =>
            user.email === selectedUser.email
              ? { ...user, role: selectedUser.role }
              : user
          )
        );
      })
      .catch((err) => {
        setResponse({
          message: err.response?.data || "Something went wrong",
          type: "error",
        });
      })
      .finally(() => {
        setSelectedUser({});
        setProcessing(false);
        setTimeout(() => {
          setResponse({
            message: "",
            type: "",
          });
        }, 5000);
      });
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8">
      <div
        className={`min-h-screen flex justify-center items-center fixed inset-0 backdrop-blur-md z-50 ${
          !selectedUser?.name && "hidden"
        }`}
      >
        <div className="w-full max-w-md bg-white border border-gray-300 rounded-lg p-4 space-y-4">
          <h4 className="text-md font-semibold text-gray-800">
            Change User Role
          </h4>
          <span className="text-sm text-gray-600">
            Select a new role for {selectedUser.name}
          </span>
          <select
            className="w-full border rounded-lg p-2 text-sm focus:outline-none focus:ring focus:ring-offset-2 focus:ring-gray-400 duration-300"
            value={selectedUser.role}
            onChange={(e) => {
              setSelectedUser({
                ...selectedUser,
                role: e.target.value,
              });
            }}
          >
            <option value="user">User</option>
            <option value="librarian">Librarian</option>
            <option value="admin">Admin</option>
          </select>
          <div className="w-full flex justify-end gap-2 text-sm">
            <button
              className={`bg-red-500 text-white px-2 py-1 border border-red-500 rounded-lg font-semibold hover:bg-red-700 duration-300 ${
                processing && "opacity-50 cursor-not-allowed"
              }`}
              onClick={() => setSelectedUser({})}
              disabled={processing}
            >
              Cancel
            </button>
            <button
              className={`bg-green-500 text-white px-2 py-1 border border-green-500 rounded-lg font-semibold hover:bg-green-700 duration-300 ${
                processing && "opacity-50 cursor-not-allowed"
              }`}
              onClick={handleRoleUpdate}
              disabled={processing}
            >
              Update
            </button>
          </div>
        </div>
      </div>
      <div className="bg-white container mx-auto p-8 space-y-6 rounded-lg border border-gray-200 shadow-lg">
        <div className="flex justify-between items-center">
          <h1 className="text-4xl font-semibold text-gray-800">
            User Management
          </h1>
          <button
            className="bg-red-500 text-md text-white px-2 py-1 border border-red-500 rounded-lg font-semibold hover:bg-red-700 duration-300"
            onClick={() => {
              window.location.href = "/signout";
            }}
          >
            Logout
          </button>
        </div>
        {response.message && (
          <div
            className={`text-center p-2 text-sm font-semibold rounded-lg border ${
              response.type === "success"
                ? "bg-green-100 text-green-700 border-green-200"
                : "bg-red-100 text-red-700 border-red-200"
            }`}
          >
            {response.message}
          </div>
        )}
        <input
          className="w-full border rounded-lg p-2 text-sm focus:outline-none focus:ring focus:ring-offset-2 focus:ring-gray-400 duration-300"
          type="text"
          placeholder="Search users"
        />
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200 rounded-lg table-fixed">
            <thead className="bg-gray-100">
              <tr className="divide-x">
                <th scope="col" className="p-2">
                  Name
                </th>
                <th scope="col" className="p-2">
                  Email
                </th>
                <th scope="col" className="p-2">
                  Role
                </th>
                <th scope="col" className="p-2">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {users.map((user, index) => (
                <tr key={index} className="text-center divide-x text-sm">
                  <td className="p-2">{user.name}</td>
                  <td className="p-2">{user.email}</td>
                  <td className="p-2">
                    {user.role === "user"
                      ? "User"
                      : user.role === "librarian"
                      ? "Librarian"
                      : "Admin"}
                  </td>
                  <td className="p-2">
                    <button
                      className="bg-white px-2 py-1 border border-gray-200 rounded-lg font-semibold hover:bg-black hover:text-white duration-300"
                      onClick={() => setSelectedUser(user)}
                    >
                      Update Role
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
