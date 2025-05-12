import { useState, useEffect, useContext } from "react";
import { toast } from "react-toastify";
import { GlobalContext } from "../context/GlobalContext";
import { Loading } from "../components/Loading";

export const Sales = () => {
  // Accessing global context
  const {
    darkMode,
    loading, setLoading,
    error,
    customers, fetchCustomers,
    products, fetchProducts,
    salesDesc, setSalesDesc, fetchSalesDesc,
  } = useContext(GlobalContext);

  const [newSale, setNewSale] = useState({
    customerId: "",
    paymentMode: "CASH",
    items: [],
  });

  const [recordsPerPage, setRecordsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);

  const [showModal, setShowModal] = useState(false);
  const [filters, setFilters] = useState({
    fromDate: "",
    toDate: new Date().toISOString().split("T")[0], // Default to today
    customerId: "",
    paymentMode: "",
  });

  useEffect(() => {
    setLoading(true);

    fetchCustomers();
    fetchProducts();
    fetchSalesDesc();
    
    setLoading(false);
  }, []);

  const handleAddSaleItem = () => {
    setNewSale((prev: any) => ({
      ...prev,
      items: [...prev.items, { productId: "", quantity: 1, unitPrice: 0 }],
    }));
  };

  const handleSaleItemChange = (
    index: number,
    field: string,
    value: string
  ) => {
    const updatedItems = [...newSale.items];
    if (field === "productId") {
      const selectedProduct = products.find(
        (p) => p.productId === parseInt(value)
      );
      if (selectedProduct) {
        updatedItems[index].productId = selectedProduct.productId;
        updatedItems[index].unitPrice = selectedProduct.price;
      }
    } else {
      updatedItems[index][field] =
        field === "quantity" ? parseInt(value) : value;
    }
    setNewSale((prev) => ({ ...prev, items: updatedItems }));
  };

  const handleRemoveSaleItem = (index: number) => {
    setNewSale((prevSale) => ({
      ...prevSale,
      items: prevSale.items.filter((_, i) => i !== index),
    }));
  };

  const handleAddSale = () => {
    const customer = customers.find(
      (c) => c.customerId === parseInt(newSale.customerId)
    );

    if (!customer) {
      toast.warn("Please select a customer.");
      return;
    }
    if (newSale.items.length === 0) {
      toast.warn("Please add at least one sale item.");
      return;
    }
    if (
      newSale.items.some((item) => item.productId === "" || item.quantity <= 0)
    ) {
      toast.warn("Please fill in all sale item details correctly.");
      return;
    }

    const salesItems = newSale.items.map((item) => {
      const product = products.find((p) => p.productId === item.productId);
      return {
        product: { productId: item.productId },
        quantity: item.quantity,
        unitPrice: product.price,
      };
    });

    // const total = salesItems.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);

    setSalesDesc((prev) => [
      ...prev,
      {
        date: new Date().toISOString().split("T")[0],
        customer,
        paymentMode: newSale.paymentMode,
        salesItems,
        udhaar: newSale.paymentMode === "UDHAAR" ? { status: "PENDING" } : null,
      },
    ]);

    setLoading(true);

    fetch("http://localhost:8080/api/sales/recordSale", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        customer: { customerId: newSale.customerId },
        paymentMode: newSale.paymentMode,
        salesItems: salesItems,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        toast.success("Sale added successfully!");
        setSalesDesc((prev) => [...prev, data]);
        setLoading(false);
      })
      .catch((err) => {
        toast.error("Failed to add sale. Please try again.");
        console.error("Error adding sale:", err);
        setLoading(false);
      });

    

    // Reset form
    setNewSale({
      customerId: "",
      paymentMode: "CASH",
      items: [],
    });
    window.location.reload(); // Refresh the page to show updated sales
  };

  const totalPages = Math.ceil(salesDesc.length / recordsPerPage);
  const currentRecords = salesDesc.slice(
    (currentPage - 1) * recordsPerPage,
    currentPage * recordsPerPage
  );

  const downloadSalesReport = () => {    
    const queryParams = new URLSearchParams();

    if (filters.fromDate) queryParams.append("from", filters.fromDate);
    if (filters.toDate) queryParams.append("to", filters.toDate);
    if (filters.customerId)
      queryParams.append("customerId", filters.customerId);
    if (filters.paymentMode)
      queryParams.append("paymentMode", filters.paymentMode);
    
    fetch(`http://localhost:8080/api/reports/sales?${queryParams.toString()}`, {
      method: "GET",
      headers: {
        Accept: "application/pdf",
      },
      credentials: "include",
    })
    .then((response) => {
      if (
        !response.ok ||
        response.headers.get("Content-Type") !== "application/pdf"
      ) {
        toast.error("Failed to generate report. Please try again.");
        throw new Error("No report available or invalid response");
      }
      return response.blob();
    })
    .then((blob) => {
      if (blob.size === 0) {
        toast.warn("No sales data found for selected filters.");
        return;
      }
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "sales_report.pdf");
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success("Sales report downloaded successfully.");
    })
    .catch((err) => {
      console.error("Error downloading report:", err);
      toast.error("Failed to download sales report.");
    })
    .finally(() => {
      setShowModal(false);
    });
  };

  return (
    <div
      className={`p-6 min-h-screen ${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-200 text-black"
      }`}
    >
      <h1 className="text-3xl font-bold mb-4">Sales Management</h1>

      {/* Add Sale Form */}
      <div className="mb-4 p-4 bg-[#646cff] text-white rounded">
        <h2 className="text-xl font-semibold mb-2">Add New Sale</h2>

        <select
          className="p-2 m-1 border rounded bg-white text-black border-0"
          value={newSale.customerId}
          onChange={(e) =>
            setNewSale({ ...newSale, customerId: e.target.value })
          }
        >
          <option value="">Select Customer</option>
          {customers.map((c: any) => (
            <option key={c.customerId} value={c.customerId}>
              {"ID: " + c.customerId + " || " + c.fname}
            </option>
          ))}
        </select>

        <select
          className="p-2 m-1 border rounded bg-white text-black border-0"
          value={newSale.paymentMode}
          onChange={(e) =>
            setNewSale({ ...newSale, paymentMode: e.target.value })
          }
        >
          <option value="CASH">Cash</option>
          <option value="UPI">UPI</option>
          <option value="CARD">Card</option>
          <option value="UDHAAR">Udhaar</option>
        </select>

        <h3 className="mt-3 font-medium">Sale Items</h3>
        {newSale.items.map(
          (
            item: { id: number; quantity: number; unitPrice: number },
            index: number
          ) => (
            <div key={index} className="flex flex-wrap gap-2 my-2 items-center">
              <select
                className="p-2 rounded text-black bg-white"
                value={item.id}
                onChange={(e) =>
                  handleSaleItemChange(index, "productId", e.target.value)
                }
              >
                <option value="">Select Product</option>
                {products.map((p) => (
                  <option key={p.productId} value={p.productId}>
                    {p.name}
                  </option>
                ))}
              </select>
              <input
                type="number"
                placeholder="Qty"
                className="p-2 rounded w-24 text-black bg-white"
                value={item.quantity}
                onChange={(e) =>
                  handleSaleItemChange(index, "quantity", e.target.value)
                }
              />
              <input
                type="number"
                placeholder="Unit Price"
                className="p-2 rounded w-28 text-black bg-white"
                value={item.unitPrice}
                disabled
              />
              {/* Remove Button */}
              <button
                className="text-xs text-red-600 rounded bg-red-100"
                onClick={() => handleRemoveSaleItem(index)}
              >
                ❌
              </button>
            </div>
          )
        )}

        <button
          className="p-1 mt-2 bg-blue-400 text-white rounded"
          onClick={handleAddSaleItem}
        >
          + Add Item
        </button>

        <button
          className="ml-3 px-4 py-2 bg-green-600 text-white rounded"
          onClick={handleAddSale}
        >
          Submit Sale
        </button>
      </div>

      {/* Pagination & Sales Table */}
      <div className="flex justify-between items-center mb-2">
        <div
          className={`flex items-center ${
            darkMode ? "bg-gray-700" : "bg-gray-300"
          } p-2 rounded`}
          >
          <span className="mr-2">Records per page:</span>
          <select
            className="p-1 rounded dark:bg-gray-600 dark:text-white"
            value={recordsPerPage}
            onChange={(e) => setRecordsPerPage(parseInt(e.target.value))}
          >
            {[5, 10, 15, 20].map((num) => (
              <option key={num} value={num}>
                {num}
              </option>
            ))}
          </select>
        </div>
        <button
          className="bg-purple-600 text-white px-4 py-2 rounded"
          onClick={() => setShowModal(true)}
        >
          📄 Download Sales Report
        </button>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div
            className={`bg-white text-black dark:bg-gray-800 dark:text-white p-6 rounded shadow-md w-full max-w-lg`}
          >
            <h2 className="text-xl font-semibold mb-4">Filter Sales Report</h2>

            <label className="block mb-2">
              From Date:
              <input
                className="w-full p-2 mt-1 border rounded"
                type="date"
                max={new Date().toISOString().split("T")[0]}
                value={filters.fromDate}
                onChange={(e) =>
                  setFilters({ ...filters, fromDate: e.target.value })
                }
              />
            </label>

            <label className="block mb-2">
              To Date:
              <input
                className="w-full p-2 mt-1 border rounded"
                type="date"
                max={new Date().toISOString().split("T")[0]}
                value={filters.toDate}
                onChange={(e) =>
                  setFilters({ ...filters, toDate: e.target.value })
                }
              />
            </label>

            <label className="block mb-2">
              Customer:
              <select
                className="w-full p-2 mt-1 border rounded dark:bg-gray-700 dark:text-white"
                value={filters.customerId}
                onChange={(e) =>
                  setFilters({ ...filters, customerId: e.target.value })
                }
              >
                <option value="">All Customers</option>
                {customers.map((c) => (
                  <option key={c.customerId} value={c.customerId}>
                    {c.fname + " " + c.lname}
                  </option>
                ))}
              </select>
            </label>

            <label className="block mb-4">
              Payment Mode:
              <select
                className="w-full p-2 mt-1 border rounded dark:bg-gray-700 dark:text-white"
                value={filters.paymentMode}
                onChange={(e) =>
                  setFilters({ ...filters, paymentMode: e.target.value })
                }
              >
                <option value="">All</option>
                <option value="CASH">Cash</option>
                <option value="UPI">UPI</option>
                <option value="CARD">Card</option>
                <option value="UDHAAR">Udhaar</option>
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
                onClick={downloadSalesReport}
              >
                Download PDF
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Loader / Error */}
      {loading && <Loading />}
      {error && <div className="text-red-500 text-center">{error}</div>}

      {/* Sales Table */}

      {!loading && !error && (
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr
              className={`${
                darkMode ? "bg-gray-700" : "bg-gray-100"
              } text-left`}
            >
              <th className="border px-4 py-2">Sale ID</th>
              <th className="border px-4 py-2">Date</th>
              <th className="border px-4 py-2">Customer</th>
              <th className="border px-4 py-2">Total (₹)</th>
              <th className="border px-4 py-2">Payment Mode</th>
              <th className="border px-4 py-2">Items</th>
              <th className="border px-4 py-2">Udhaar Status</th>
            </tr>
          </thead>
          <tbody>
            {currentRecords.map((sale) => (
              <tr
                key={sale.saleId}
                className={`${darkMode ? "bg-gray-800" : "bg-white"}`}
              >
                <td className="border px-4 py-2">{sale.saleId}</td>
                <td className="border px-4 py-2">{sale.date}</td>
                <td className="border px-4 py-2">
                  {sale.customerName}
                </td>
                <td className="border px-4 py-2">₹{sale.totalAmount}</td>
                <td className="border px-4 py-2">{sale.paymentMode}</td>
                <td className="border px-4 py-2">
                  {sale.salesItems.map((item, i: number) => (
                    <div key={i}>
                      {item.productName} (x{item.quantity}) - ₹
                      {item.unitPrice * item.quantity}
                    </div>
                  ))}
                </td>
                <td className="border px-4 py-2">
                  {sale.paymentMode === "UDHAAR" ? (
                    <span
                      className={`font-bold ${
                        sale.udhaar?.status === "OVERDUE"
                          ? "text-red-500"
                          : "text-yellow-400"
                      }`}
                    >
                      {sale.udhaar?.status || "PENDING"}
                    </span>
                  ) : (
                    "N/A"
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Pagination Controls */}
      <div className="flex justify-center mt-4">
        <button
          className={`px-4 py-2 bg-gray-500 text-white rounded mx-1${
            currentPage === 1 ? "opacity-50" : ""}`}
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => prev - 1)}
        >
          Previous
        </button>
        <span className="mx-2 p-2 text-lg">
          {currentPage} / {totalPages}
        </span>
        <button
          className={`px-4 py-2 bg-gray-500 text-white rounded mx-1${
            currentPage === totalPages ? "opacity-50" : ""}`}
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((prev) => prev + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
};
