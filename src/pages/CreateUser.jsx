import { useState, useContext } from "react";
import { GlobalContext } from "../context/GlobalContext";
import { toast } from "react-toastify";

export const CreateUser = () => {
  const { user, darkMode, BACKEND_API_URL, logout } = useContext(GlobalContext);

  const [newUser, setUser] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState("");

  const validate = () => {
    const newErrors = {};

    if (!newUser.username.trim()) newErrors.username = "Username is required";

    if (!newUser.email.trim()) newErrors.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(newUser.email))
      newErrors.email = "Invalid email format";

    if (!newUser.password) newErrors.password = "Password is required";
    else if (newUser.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";

    if (newUser.password !== newUser.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";

    setErrors(newErrors);
    toast.error(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess("");

    if (!validate()) return;

    try {
      const response = await fetch(BACKEND_API_URL + "/admin/createAdmin", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: newUser.username,
          password: newUser.password,
          email: newUser.email,
        }),
      });

      if (response.ok) {
        setSuccess("User created successfully!");
        toast.success(success);
        setUser({ username: "", email: "", password: "", confirmPassword: "" });
        setErrors({});

        setTimeout(() => {
          toast.success("Redirecting to login page...");
          logout(); // Call the logout function to clear session
          window.location.href = "/"; // Redirect to login page after 1 second
        }, 2000);
      } else if(response.ok === false) {
        
        toast.error("User already exists");
        
        setErrors({ form: data.message || "Failed to create user" });
      }
    } catch (error) {
      setErrors({ form: "Something went wrong. Please try again." });
      toast.error(errors);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white dark:bg-gray-800 p-6 rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Create New User</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          className="w-full p-2 mb-2 rounded bg-gray-100 dark:bg-gray-700 dark:text-white"
          value={newUser.username}
          onChange={(e) => setUser({ ...newUser, username: e.target.value })}
        />
        {errors.username && (
          <p className="text-red-500 text-sm">{errors.username}</p>
        )}

        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 mb-2 rounded bg-gray-100 dark:bg-gray-700 dark:text-white"
          value={newUser.email}
          onChange={(e) => setUser({ ...newUser, email: e.target.value })}
        />
        {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}

        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 mb-2 rounded bg-gray-100 dark:bg-gray-700 dark:text-white"
          value={newUser.password}
          onChange={(e) => setUser({ ...newUser, password: e.target.value })}
        />
        {errors.password && (
          <p className="text-red-500 text-sm">{errors.password}</p>
        )}

        <input
          type="password"
          placeholder="Confirm Password"
          className="w-full p-2 mb-2 rounded bg-gray-100 dark:bg-gray-700 dark:text-white"
          value={newUser.confirmPassword}
          onChange={(e) =>
            setUser({ ...newUser, confirmPassword: e.target.value })
          }
        />
        {errors.confirmPassword && (
          <p className="text-red-500 text-sm">{errors.confirmPassword}</p>
        )}

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Create User
        </button>
      </form>
    </div>
  );
};
