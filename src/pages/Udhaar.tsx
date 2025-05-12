import { useContext, useEffect } from "react";
import { GlobalContext } from "../context/GlobalContext";
// import axios from "axios";
import { Loading } from "../components/Loading";

export const Udhaar = () => {
  const { darkMode, udhaar, fetchUdhaar, loading, setLoading } = useContext(GlobalContext);

  useEffect(() => {
    setLoading(true);
    fetchUdhaar()
      .then(() => setLoading(false))
    
  }, []);

  return (
    <div className={`p-4 min-h-screen ${darkMode ? "bg-[#555] text-white" : "bg-[#ccc] text-black"}`}>
      <h2 className="text-2xl font-bold mb-4">Udhaar Records</h2>

      {loading ? (
        <Loading />
      ) : (
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="dark:bg-gray-800 text-white">
              <th className="border p-2">ID</th>
              <th className="border p-2">Customer</th>
              <th className="border p-2">Amount Due</th>
              <th className="border p-2">Due Date</th>
              <th className="border p-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {udhaar.map((u : any) => (
              <tr key={u.udhaarId} className="hover:bg-gray-500 dark:bg-gray-700 transition-colors duration-100">
                <td className="border p-2">{u.udhaarId}</td>
                <td className="border p-2">{u.customerName}</td>
                <td className="border p-2">₹{u.amountDue}</td>
                <td className="border p-2">{u.dueDate}</td>
                <td className={`border p-2 ${udhaar.status === "OVERDUE" ? "text-red-500" : ""}`}>{(u.status).toString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};
