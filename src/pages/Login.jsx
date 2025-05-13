import React, { useContext, useState } from "react";
import { GlobalContext } from "../context/GlobalContext";
import { useNavigate } from "react-router-dom";

export const Login = () => {
  const { login, BACKEND_API_URL } = useContext(GlobalContext);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await fetch(BACKEND_API_URL +"/admin/login", {
        method: "POST",
        credentials: "include", // Make sure cookies are included
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username,
          password: password
        }),
      });

      // Check if login was successful and if session cookie is set
      if (response.status === 200) {
        const data = await response.json();
        login(data); // Call the login function from context
        navigate("/"); 
      } else {
        alert("Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="bg-blue-900 p-5 shadow-md rounded-md w-100 h-100 flex flex-col justify-around items-center">
        <h2 className="text-xl font-bold">Login</h2>
        <input
          type="text"
          placeholder="Username"
          className="block border p-2 my-2"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="block border p-2 my-2"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={handleLogin}>
          Login
        </button>
      </div>
    </div>
  );
};

