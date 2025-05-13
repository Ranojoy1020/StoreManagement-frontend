import { useState, useEffect, useContext } from "react";
import { GlobalContext } from "../context/GlobalContext";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { split } from "postcss/lib/list";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export const Dashboard = () => {
  const [stats, setStats] = useState({
    totalSales: 0,
    totalInventory: 0,
    pendingUdhaar: 0,
  });

  const [salesData, setSalesData] = useState([]);
  const [transactions, setTransactions] = useState([]);

  const {
    user,
    darkMode,
    setLoading,
    inventory,
    fetchInventory,
    sales,
    fetchSales,
    salesDesc,
    fetchSalesDesc,
    expenses,
    fetchExpenses,
    unpaidUdhaar,
    fetchUnpaidUdhaar,
    BACKEND_API_URL,
  } = useContext(GlobalContext); // Access fetchInventory function from context

  const [topProducts, setTopProducts] = useState([]);
  const [period, setPeriod] = useState("all");

  const fetchTopProducts = async (selectedPeriod) => {
    setLoading(true);
    try {
      const res = await fetch(
        BACKEND_API_URL + `/sales/top-products/${selectedPeriod}`,
        {
          credentials: "include",
        }
      );
      const data = await res.json();
      setTopProducts(data);
    } catch (error) {
      console.error("Failed to fetch top products", error);
      setTopProducts([]); // Reset to empty array on error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTopProducts(period);
  }, [period]);

  useEffect(() => {
    setLoading(true); // Set loading to true when component mounts

    // Fetch data from API
    fetchInventory();
    fetchSales();
    fetchSalesDesc();
    fetchExpenses();
    fetchUnpaidUdhaar();

    setLoading(false); // Set loading to false after data is fetched
  }, []);

  useEffect(() => {
    // Calculate total sales, inventory, and udhaar
    const totalSales = sales.reduce((acc, sale) => acc + sale.totalAmount, 0);
    const totalInventory = inventory.length;
    const pendingUdhaar = unpaidUdhaar.reduce(
      (acc, udhaar) => acc + udhaar.amountDue,
      0
    );

    // Set transactions data
    const mergedList = [...salesDesc, ...expenses];

    const normalizedList = mergedList.map((item) => {
      return {
        ...item,
        date: item.saleDate || item.expenseDate || null,
        type: item.saleDate ? "sale" : "expense",
      };
    });

    // Step 2: Sort descending by date (latest first)
    const sortedByDate = normalizedList.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    // Step 3: Take the latest 5
    const latestFive = sortedByDate.slice(0, 5);
    setTransactions(latestFive);

    // Set stats
    setStats({
      totalSales,
      totalInventory,
      pendingUdhaar,
    });

    // Prepare sales data for chart
    const salesData = sales.map((sale) => ({
      day: split(sale.saleDate, "T")[0],
      sales: sale.totalAmount,
    }));

    setSalesData(salesData);
  }, [inventory, sales, unpaidUdhaar]);

  // Step 1: Group and sum sales by day
  const salesByDay = salesData.reduce((acc, curr) => {
    const day = curr.day || "No Data";
    acc[day] = (acc[day] || 0) + curr.sales;
    return acc;
  }, {});

  // Step 2: Prepare chart data from aggregated results
  const chartData = {
    labels: Object.keys(salesByDay),
    datasets: [
      {
        label: "Sales (₹)",
        data: Object.values(salesByDay),
        borderColor: "rgb(75, 192, 192)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        fill: true,
      },
    ],
  };

  return (
    <div
      className={`p-6 min-h-screen ${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-200 text-black"
      }`}
    >
      <h1 className="text-3xl font-bold mb-4">
        Welcome, {user ? user : "User"}!
      </h1>

      <div className="grid lg:grid-cols-2 md:grid-cols-1 gap-6">
        <div className="flex flex-col gap-2">
          <div className="p-4 rounded-lg shadow-md bg-blue-500 text-white">
            <h2 className="text-xl font-semibold">Total Sales</h2>
            <p className="text-2xl mt-2">₹{stats.totalSales}</p>
          </div>
          <div className="p-4 rounded-lg shadow-md bg-green-500 text-white">
            <h2 className="text-xl font-semibold">Total Inventory</h2>
            <p className="text-2xl mt-2">{stats.totalInventory} Items</p>
          </div>
          <div className="p-4 rounded-lg shadow-md bg-red-500 text-white">
            <h2 className="text-xl font-semibold">Pending Udhaar</h2>
            <p className="text-2xl mt-2">₹{stats.pendingUdhaar}</p>
          </div>
        </div>
        <div
          className={`p-6 rounded-lg shadow-md ${
            darkMode ? "bg-gray-800 text-white" : "bg-white text-black"
          }`}
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Top Sold Products</h2>
            <div className="space-x-2">
              {["week", "month", "all"].map((p) => (
                <button
                  key={p}
                  className={`rounded-full font-semibold transition ${
                    period === p
                      ? "bg-blue-500 text-white"
                      : darkMode
                      ? "bg-gray-700 text-gray-300"
                      : "bg-gray-200 text-gray-700"
                  }`}
                  onClick={() => setPeriod(p)}
                >
                  {p.charAt(0).toUpperCase() + p.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className={darkMode ? "bg-gray-700" : "bg-gray-100"}>
                <th className="border border-gray-300 p-2">#</th>
                <th className="border border-gray-300 p-2">Product</th>
                <th className="border border-gray-300 p-1">Quantity Sold</th>
              </tr>
            </thead>
            <tbody>
              {topProducts.map((prod, index) => (
                <tr
                  key={prod.productName}
                  className={darkMode ? "bg-gray-700" : "bg-white"}
                >
                  <td className="border border-gray-300 px-4 py-2">
                    {index + 1}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {prod.productName}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {prod.quantitySold}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Sales Chart */}

        <div
          className={`p-6 mt-6 rounded-lg shadow-md ${
            darkMode ? "bg-gray-800" : "bg-white"
          }`}
        >
          <h2 className="text-xl font-bold mb-4">Sales Trends (This Week)</h2>
          <Line data={chartData} />
        </div>

        {/* Recent Transactions Table */}
        <div
          className={`p-6 mt-6 rounded-lg shadow-md ${
            darkMode ? "bg-gray-800" : "bg-white"
          }`}
        >
          <h2 className="text-xl font-bold mb-4">Recent Transactions</h2>
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr
                className={`${
                  darkMode ? "bg-gray-700" : "bg-gray-100"
                } text-left`}
              >
                <th className="border border-gray-300 px-4 py-2">#</th>
                <th className="border border-gray-300 px-4 py-2">Type</th>
                <th className="border border-gray-300 px-4 py-2">Amount</th>
                <th className="border border-gray-300 px-4 py-2">Date</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((txn, index) => (
                <tr
                  key={index}
                  className={`text-center ${
                    darkMode ? "bg-gray-700" : "bg-white"
                  }`}
                >
                  <td className="border border-gray-300 px-4 py-2">{index + 1}</td>
                  <td className="border border-gray-300 px-4 py-2">
                    {(txn.type).charAt(0).toUpperCase() + txn.type.slice(1)}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {txn.amount || txn.totalAmount}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {split(txn.date, "T")[0]}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
