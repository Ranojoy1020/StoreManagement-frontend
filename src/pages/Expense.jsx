import React, { useState, useEffect, useContext } from "react";
import { GlobalContext } from "../context/GlobalContext";
import axios from "axios";
import { toast } from "react-toastify";
import { Loading } from "../components/Loading";

export const Expense = () => {

  const expenseCategories = [
    {
      label: "Cost of Goods Sold",
      options: [
        { value: "INVENTORY_PURCHASE", label: "Inventory Purchase" },
        { value: "FREIGHT_AND_DELIVERY", label: "Freight & Delivery" },
        { value: "SPOILAGE", label: "Spoilage" },
      ],
    },
    {
      label: "Operational Expenses",
      options: [
        { value: "RENT", label: "Rent" },
        { value: "UTILITIES", label: "Utilities" },
        { value: "INTERNET_AND_PHONE", label: "Internet & Phone" },
        { value: "POS_SOFTWARE", label: "POS Software" },
      ],
    },
    {
      label: "Staff Expenses",
      options: [
        { value: "SALARIES", label: "Salaries" },
        { value: "OVERTIME", label: "Overtime" },
        { value: "EMPLOYEE_BENEFITS", label: "Employee Benefits" },
        { value: "TRAINING", label: "Training" },
        { value: "UNIFORMS", label: "Uniforms" },
      ],
    },
    {
      label: "Logistics",
      options: [
        { value: "VEHICLE_MAINTENANCE", label: "Vehicle Maintenance" },
        { value: "DELIVERY_FEES", label: "Delivery Fees" },
      ],
    },
    {
      label: "Packaging & Supplies",
      options: [
        { value: "PACKAGING_SUPPLIES", label: "Packaging Supplies" },
        { value: "CLEANING_SUPPLIES", label: "Cleaning Supplies" },
        { value: "OFFICE_SUPPLIES", label: "Office Supplies" },
      ],
    },
    {
      label: "Marketing",
      options: [
        { value: "ADVERTISING", label: "Advertising" },
        { value: "PROMOTIONS", label: "Promotions" },
        { value: "LOYALTY_PROGRAMS", label: "Loyalty Programs" },
      ],
    },
    {
      label: "Security",
      options: [
        { value: "SECURITY_SYSTEMS", label: "Security Systems" },
        { value: "FIRE_SAFETY", label: "Fire Safety" },
        { value: "GUARDS", label: "Security Guards" },
      ],
    },
    {
      label: "Technology",
      options: [
        { value: "BILLING_SOFTWARE", label: "Billing Software" },
        { value: "INVENTORY_SYSTEM", label: "Inventory System" },
        { value: "WEBSITE_HOSTING", label: "Website Hosting" },
      ],
    },
    {
      label: "Professional Services",
      options: [
        { value: "ACCOUNTING_FEES", label: "Accounting Fees" },
        { value: "LEGAL_FEES", label: "Legal Fees" },
        { value: "LICENSE_RENEWALS", label: "License Renewals" },
      ],
    },
    {
      label: "Financial Charges",
      options: [
        { value: "LOAN_EMI", label: "Loan EMI" },
        { value: "BANK_FEES", label: "Bank Fees" },
        { value: "CARD_TRANSACTION_FEES", label: "Card Transaction Fees" },
      ],
    },
    {
      label: "Maintenance",
      options: [
        { value: "EQUIPMENT_REPAIRS", label: "Equipment Repairs" },
        { value: "STORE_MAINTENANCE", label: "Store Maintenance" },
        { value: "PEST_CONTROL", label: "Pest Control" },
      ],
    },
    {
      label: "Other",
      options: [
        { value: "FRANCHISE_FEES", label: "Franchise Fees" },
        { value: "CENTRAL_WAREHOUSING", label: "Central Warehousing" },
      ],
    },
  ];

  const {
    darkMode,
    expenses,
    setExpenses,
    fetchExpenses,
    suppliers,
    fetchSuppliers,
    loading,
    setLoading,
    BACKEND_API_URL,
  } = useContext(GlobalContext);

  const [newExpense, setNewExpense] = useState({
    amount: "",
    category: "",
    supplierId: "",
    description: "",
    date: new Date().toISOString().split("T")[0], // Default to today's date
  });

  const [showModal, setShowModal] = useState(false);
  const [filters, setFilters] = useState({
    fromDate: "",
    toDate: "",
    category: "",
  });

  useEffect(() => {
    setLoading(true);
    fetchExpenses()
      .then(() => setLoading(false))
      .catch((error) => {
        console.error("Error fetching expenses:", error);
        setLoading(false);
      });

    fetchSuppliers()
      .then(() => setLoading(false))
      .catch((error) => {
        console.error("Error fetching suppliers:", error);
        setLoading(false);
      });
  }, []);

  const handleAdd = () => {
    if (!newExpense.amount || !newExpense.category) {
      toast.warn("Please fill in all required fields.");
      return;
    }

    axios
      .post(BACKEND_API_URL + "/expenses/addExpense", newExpense, {withCredentials: true})
      .then((res) => {
        setExpenses((prev) => [...prev, res.data]);
        setNewExpense({ amount: "", category: "", description: "", date: "" });
        setShowModal(false);
        toast.success("Expense added.");
      })
      .catch((err) => {
        console.error(err);
        toast.error("Failed to add expense.");
      });
  };

  const handleDelete = (id) => {
    axios
      .delete(BACKEND_API_URL + `/expenses/deleteExpense/${id}`, {withCredentials: true})
      .then(() => {
        setExpenses((prev) => prev.filter((e) => e.expenseId !== id));
        toast.success("Expense deleted.");
      })
      .catch((err) => {
        console.error(err);
        toast.error("Failed to delete expense.");
      });
  };

  const downloadExpenseReport = () => {
    const queryParams = new URLSearchParams();
    if (filters.fromDate) queryParams.append("from", filters.fromDate);
    if (filters.toDate) queryParams.append("to", filters.toDate);
    if (filters.category) queryParams.append("category", filters.category);

    axios
      .get(
        BACKEND_API_URL + `/reports/expenses?${queryParams.toString()}`,
        {
          responseType: "blob",
          withCredentials: true,
          headers: { Accept: "application/pdf" },
        }
      )
      .then((response) => {
        if (response.data.size === 0) {
          toast.warn("No expenses found for the selected filters.");
          return;
        }

        const blob = new Blob([response.data], { type: "application/pdf" });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "expense_report.pdf");
        document.body.appendChild(link);
        link.click();
        link.remove();
        toast.success("Expense report downloaded.");
      })
      .catch((err) => {
        console.error(err);
        toast.error("Failed to download report.");
      })
      .finally(() => setShowModal(false));
  };

  return (
    <div
      className={`p-6 min-h-screen ${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-200 text-black"
      }`}
    >
      <h1 className="text-3xl font-bold mb-4">Expense Management</h1>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-[rgba(0,0,0,0.9)] flex justify-center items-center z-50">
          <div
            className={`bg-white text-black dark:bg-gray-800 dark:text-white p-6 rounded-xl shadow-md w-full max-w-lg`}
          >
            <h2 className="text-xl font-semibold mb-4">
              Filter Expense Report
            </h2>

            <label className="block mb-2">
              From Date:
              <input
                type="date"
                className="w-full p-2 mt-1 border rounded dark:bg-gray-700 dark:text-white"
                value={filters.fromDate}
                max={new Date().toISOString().split("T")[0]} // Prevent future dates
                onChange={(e) =>
                  setFilters({ ...filters, fromDate: e.target.value })
                }
              />
            </label>

            <label className="block mb-2">
              To Date:
              <input
                type="date"
                className="w-full p-2 mt-1 border rounded dark:bg-gray-700 dark:text-white"
                value={filters.toDate}
                max={new Date().toISOString().split("T")[0]} // Prevent future dates
                onChange={(e) =>
                  setFilters({ ...filters, toDate: e.target.value })
                }
              />
            </label>

            <label className="block mb-4">
              Category:
              <select
                className="p-2 m-1 border rounded dark:bg-gray-700 dark:text-white"
                value={filters.category}
                onChange={(e) =>
                  setFilters({ ...filters, category: e.target.value })
                }
              >
                <option value="">Select Category</option>

                {expenseCategories.map((group) => (
                  <optgroup key={group.label} label={group.label}>
                    {group.options.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </label>

            <div className="flex justify-end gap-4">
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded"
                onClick={downloadExpenseReport}
              >
                Download PDF
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Expense Form */}
      <div className="mb-4 p-4 bg-blue-500 rounded">
  <h2 className="text-xl font-semibold mb-2">Add Expense</h2>

  {/* Amount */}
  <input
    type="number"
    placeholder="Amount"
    className="p-2 m-1 rounded dark:bg-gray-700 dark:text-white"
    value={newExpense.amount}
    onChange={(e) =>
      setNewExpense({ ...newExpense, amount: e.target.value })
    }
  />

  {/* Category */}
  <select
    className="p-2 m-1 rounded dark:bg-gray-700 dark:text-white"
    value={newExpense.category}
    onChange={(e) =>
      setNewExpense({ ...newExpense, category: e.target.value })
    }
  >
    <option value="">Select Category</option>
    {expenseCategories.map((group) => (
      <optgroup key={group.label} label={group.label}>
        {group.options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </optgroup>
    ))}
  </select>

  {/* Conditionally Show Supplier Input */}
  {newExpense.category === "INVENTORY_PURCHASE" && (
    <select
      className="p-2 m-1 rounded dark:bg-gray-700 dark:text-white"
      value={newExpense.supplierId}
      onChange={(e) =>
        setNewExpense({ ...newExpense, supplierId: e.target.value })
      }
    >
      <option value="">Select Supplier</option>
      {suppliers.map((supplier) => (
        <option key={supplier.supplierId} value={supplier.supplierId}>
          {supplier.name}
        </option>
      ))}
    </select>
  )}

  {/* Description */}
  <input
    type="text"
    placeholder="Description"
    className="p-2 m-1 rounded dark:bg-gray-700 dark:text-white"
    value={newExpense.description}
    onChange={(e) =>
      setNewExpense({ ...newExpense, description: e.target.value })
    }
  />

  {/* Date */}
  <input
    type="date"
    className="p-2 m-1 rounded dark:bg-gray-700 dark:text-white"
    value={newExpense.date}
    max={new Date().toISOString().split("T")[0]}
    onChange={(e) =>
      setNewExpense({ ...newExpense, date: e.target.value })
    }
  />

  {/* Add Button */}
  <button
    className="ml-2 px-4 py-2 bg-green-600 text-white rounded"
    onClick={handleAdd}
  >
    Add
  </button>
</div>


      {/* Download Report Button */}
      <div className="mb-4 float-right">
        <button
          className="bg-purple-600 text-white px-4 py-2 rounded"
          onClick={() => setShowModal(true)}
        >
          📄 Download Expense Report
        </button>
      </div>

      {/* Expense Table */}
      {loading ? (
        <Loading />
      ) : (
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr
              className={`${
                darkMode ? "bg-gray-700" : "bg-gray-100"
              } text-left`}
            >
              <th className="border px-4 py-2">ID</th>
              <th className="border px-4 py-2">Amount</th>
              <th className="border px-4 py-2">Category</th>
              <th className="border px-4 py-2">Description</th>
              <th className="border px-4 py-2">Date</th>
              <th className="border px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((e) => (
              <tr
                key={e.expenseId}
                className={`${darkMode ? "bg-gray-700" : "bg-white"}`}
              >
                <td className="border px-4 py-2">{e.expenseId}</td>
                <td className="border px-4 py-2">₹{e.amount}</td>
                <td className="border px-4 py-2">{e.category}</td>
                <td className="border px-4 py-2">{e.description}</td>
                <td className="border px-4 py-2">{e.date}</td>
                <td className="border px-4 py-2">
                  <button
                    className="bg-red-600 px-3 py-1 text-white rounded"
                    onClick={() => handleDelete(e.expenseId)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};
