import { useState, useContext } from "react";
import axios from "axios";
import { GlobalContext } from "../context/GlobalContext";
import { toast } from "react-toastify";

export const UpdatePassword = () => {
  const { user, darkMode, loading, setLoading, BACKEND_API_URL } = useContext(GlobalContext);

  const [oldPassword, setoldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleUpdatePassword = async () => {
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match.");
      return;
    }

    try {
      setLoading(true);
      await axios.put(
        BACKEND_API_URL + "/admin/update-password",
        {
            "username" : user,
            "oldPassword" : oldPassword,
            "newPassword" : newPassword,
        },
        { withCredentials: true }
      );

      toast.success("Password updated successfully.");
      setoldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      console.error("Update error:", error);
      toast.error(
        error.response?.data?.message || "Failed to update password."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`p-6 max-w-md mx-auto mt-10 rounded-lg shadow-lg ${
        darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
      }`}
    >
      <h2 className="text-2xl font-semibold mb-4">Update Password</h2>

      <input
        type="password"
        placeholder="Current Password"
        className="w-full mb-3 p-2 border rounded dark:bg-gray-700"
        value={oldPassword}
        onChange={(e) => setoldPassword(e.target.value)}
      />
      <input
        type="password"
        placeholder="New Password"
        className="w-full mb-3 p-2 border rounded dark:bg-gray-700"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
      />
      <input
        type="password"
        placeholder="Confirm New Password"
        className="w-full mb-4 p-2 border rounded dark:bg-gray-700"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />

      <button
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        onClick={handleUpdatePassword}
        disabled={loading}
      >
        {loading ? "Updating..." : "Update Password"}
      </button>
    </div>
  );
};
