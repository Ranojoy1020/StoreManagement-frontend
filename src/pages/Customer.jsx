import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { GlobalContext } from "../context/GlobalContext";
import { Loading } from "../components/Loading";
import { toast } from "react-toastify";

export const Customer = () => {
  const {
    darkMode,
    customers,
    fetchCustomers,
    loading,
    setLoading,
    BACKEND_API_URL,
  } = useContext(GlobalContext);

  const [newCustomer, setNewCustomer] = useState({
    fname: "",
    lname: "",
    phone: "",
    email: "",
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetchCustomers()
      .then(() => setLoading(false))
      .catch((error) => {
        console.error("Error fetching customers:", error);
        setLoading(false);
        toast.error("Failed to fetch customers.");
      });
  }, []);

  const handleInputChange = (e) => {
    setNewCustomer({
      ...newCustomer,
      [e.target.name]: e.target.value,
    });
  };

  const validateForm = () => {
    const { fname, lname, phone, email } = newCustomer;
    const phoneRegex = /^[0-9]{10}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!fname || !lname || !phone || !email) {
      toast.warn("Please fill in all fields.");
      return false;
    }

    if (!phoneRegex.test(phone)) {
      toast.warn("Phone must be 10 digits.");
      return false;
    }

    if (!emailRegex.test(email)) {
      toast.warn("Invalid email format.");
      return false;
    }

    return true;
  };

  const handleAddCustomer = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSubmitting(true);
    try {
      await axios.post(BACKEND_API_URL + "/customers/addCustomer", newCustomer,{withCredentials: true});
      await fetchCustomers();
      setNewCustomer({ fname: "", lname: "", phone: "", email: "" });
      toast.success("Customer added successfully!");
    } catch (err) {
      console.error("Add customer failed:", err);
      toast.error("Failed to add customer." + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className={`p-6 min-h-screen ${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-200 text-black"
      }`}
    >
      <h2 className="text-2xl font-bold mb-4">Customer List</h2>

      {/* Add New Customer Section */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow mb-6">
        <h3 className="text-xl font-semibold mb-3">Add New Customer</h3>
        <form
          onSubmit={handleAddCustomer}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <input
            type="text"
            name="fname"
            placeholder="First Name"
            value={newCustomer.fname}
            onChange={handleInputChange}
            className="p-2 border rounded dark:bg-gray-700 dark:text-white"
            required
          />
          <input
            type="text"
            name="lname"
            placeholder="Last Name"
            value={newCustomer.lname}
            onChange={handleInputChange}
            className="p-2 border rounded dark:bg-gray-700 dark:text-white"
            required
          />
          <input
            type="text"
            name="phone"
            placeholder="Phone (10 digits)"
            value={newCustomer.phone}
            onChange={handleInputChange}
            className="p-2 border rounded dark:bg-gray-700 dark:text-white"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={newCustomer.email}
            onChange={handleInputChange}
            className="p-2 border rounded dark:bg-gray-700 dark:text-white"
            required
          />
          <button
            type="submit"
            disabled={submitting}
            className="md:col-span-2 p-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {submitting ? "Adding..." : "Add Customer"}
          </button>
        </form>
      </div>

      {loading ? (
        <Loading />
      ) : (
        <table
          className={`w-full border-collapse border ${
            darkMode ? "border-gray-700" : "border-gray-300"
          }`}
        >
          <thead>
            <tr
              className={`${
                darkMode
                  ? "border-gray-700 bg-blue-600"
                  : "border-gray-300 bg-blue-600"
              }`}
            >
              <th className="border p-2">ID</th>
              <th className="border p-2">First Name</th>
              <th className="border p-2">Last Name</th>
              <th className="border p-2">Contact</th>
            </tr>
          </thead>
          <tbody>
            {customers.map(
              (customer) => (
                <tr
                  key={customer.customerId}
                  className="bg-gray-700 text-white hover:bg-gray-100 hover:text-black"
                >
                  <td className="border p-2">{customer.customerId}</td>
                  <td className="border p-2">{customer.fname}</td>
                  <td className="border p-2">{customer.lname}</td>
                  <td className="border p-2">{customer.phone}</td>
                </tr>
              )
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};
