import { useContext, useEffect } from "react";
import { GlobalContext } from "../context/GlobalContext";
import { Loading } from "../components/Loading";
import axios from "axios";

export const Udhaar = () => {
  const {
    darkMode,
    udhaar,
    fetchUdhaar,
    loading,
    setLoading,
    BACKEND_API_URL,
  } = useContext(GlobalContext);

  useEffect(() => {
    setLoading(true);
    fetchUdhaar().finally(() => setLoading(false));
  }, []);

  const handleMarkAsPaid = async (udhaarId) => {
    setLoading(true);
    axios.put(
      `${BACKEND_API_URL}/udhaar/${udhaarId}/pay`,
      {},
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then((response) => {
        console.log("Udhaar marked as paid:", response.data);
      })
      .catch((error) => {
        console.error("Error marking udhaar as paid:", error);
      });
    await fetchUdhaar(); // Refresh the list
    setLoading(false);
  };

  return (
    <div
      className={`p-4 min-h-screen ${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-200 text-black"
      }`}
    >
      <h2 className="text-2xl font-bold mb-4">Udhaar Records</h2>

      {loading ? (
        <Loading />
      ) : (
        <table className="w-full border-collapse">
          <thead>
            <tr className="dark:bg-gray-800 text-white">
              <th className="border p-2">ID</th>
              <th className="border p-2">Customer</th>
              <th className="border p-2">Amount Due</th>
              <th className="border p-2">Due Date</th>
              <th className="border p-2">Status</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {udhaar.map((u) => (
              <tr
                key={u.udhaarId}
                className="hover:bg-gray-500 dark:bg-gray-700 text-white transition-colors duration-100"
              >
                <td className="border p-2">{u.udhaarId}</td>
                <td className="border p-2">{u.customerName}</td>
                <td className="border p-2">₹{u.amountDue}</td>
                <td className="border p-2">{u.dueDate}</td>
                <td
                  className={`border p-2 ${
                    u.status === "OVERDUE" ? "text-red-400 border-white" : "text-white"
                  }`}
                >
                  {u.status}
                </td>
                <td className="border p-2">
                  {(u.status === "PENDING" || u.status === "OVERDUE") && (
                    <button
                      className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                      onClick={() => handleMarkAsPaid(u.udhaarId)}
                    >
                      Mark as Paid
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};
