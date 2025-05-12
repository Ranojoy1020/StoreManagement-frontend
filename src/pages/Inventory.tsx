import React, { useEffect, useState, useContext } from "react";
import { GlobalContext } from "../context/GlobalContext";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const Inventory = () => {
  const { darkMode, inventory, setInventory, fetchInventory, products, setProducts, fetchProducts } =
    useContext(GlobalContext);

  const [newEntry, setNewEntry] = useState({
    productId: "",
    quantity: "",
    minStockThreshold: "",
  });

  const [showModal, setShowModal] = useState(false);
  const [editEntry, setEditEntry] = useState({});
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(inventory.length / itemsPerPage);

  const notify = (msg, type = "success") => toast[type](msg);

  useEffect(() => {
    fetchInventory()
    fetchProducts()
  }, []);

  const handleAddInventory = () => {
    if (!newEntry.productId || !newEntry.quantity) return;

    fetch(
      `http://localhost:8080/api/inventory/${newEntry.productId}?stockQuantity=${newEntry.quantity}&minStockThreshold=${newEntry.minStockThreshold}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      }
    )
      .then((res) => res.json())
      .then((newItem) => {
        setInventory((prev) => [...prev, newItem]);
        setNewEntry({ productId: "", quantity: "", minStockThreshold: "" });
        notify("Inventory item added!");
      })
      .catch((err) => {
        console.error(err);
        notify("Error adding inventory", "error");
      });
  };

  const handleUpdate = () => {
    fetch(
      `http://localhost:8080/api/inventory/${editEntry.product.productId}?stockQuantity=${editEntry.stockQuantity}&minStockThreshold=${editEntry.minStockThreshold}`,
      {
        method: "POST",
        credentials: "include",
      }
    )
      .then((res) => res.json())
      .then((updatedItem) => {
        setInventory((prev) =>
          prev.map((inv) =>
            inv.inventoryId === updatedItem.inventoryId ? updatedItem : inv
          )
        );
        setShowModal(false);
        notify("Inventory updated successfully!");
      })
      .catch((err) => {
        console.error(err);
        notify("Failed to update inventory", "error");
      });
  };

  const handleDelete = (id) => {
    fetch(`http://localhost:8080/api/inventory/${id}`, {
      method: "DELETE",
      credentials: "include",
    })
      .then(() => {
        setInventory((prev) => prev.filter((inv) => inv.inventoryId !== id));
        setDeleteConfirmId(null);
        notify("Inventory deleted.");
      })
      .catch((err) => {
        console.error(err);
        notify("Delete failed", "error");
      });
  };

  const paginatedInventory = inventory.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div
      className={`p-6 min-h-screen ${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-200 text-black"
      }`}
    >
      <h1 className="text-3xl font-bold mb-4">Inventory Management</h1>

      {/* Add Inventory Form */}
      <div className="mb-6 p-4 bg-blue-100 dark:bg-blue-800 rounded">
        <h2 className="text-xl font-semibold mb-2">Add New Inventory</h2>
        <div className="flex flex-wrap gap-2">
          <select
            value={newEntry.productId}
            onChange={(e) =>
              setNewEntry({ ...newEntry, productId: e.target.value })
            }
            className={`p-2 border rounded ${
              darkMode ? "bg-gray-700 text-white" : "bg-white text-black"
            }`}
          >
            <option value="">Select Product</option>
            {products.map((product) => (
              <option key={product.productId} value={product.productId}>
                {product.name +
                  " " +
                  product.quantityPerUnit +
                  " " +
                  product.unit}
              </option>
            ))}
          </select>
          <input
            type="number"
            placeholder="Stock Quantity"
            className={`p-2 border rounded ${
              darkMode ? "bg-gray-700 text-white" : "bg-white text-black"
            }`}
            value={newEntry.quantity}
            onChange={(e) =>
              setNewEntry({ ...newEntry, quantity: e.target.value })
            }
          />
          <input
            type="number"
            placeholder="Stock Threshold"
            className={`p-2 border rounded ${
              darkMode ? "bg-gray-700 text-white" : "bg-white text-black"
            }`}
            value={newEntry.minStockThreshold}
            onChange={(e) =>
              setNewEntry({
                ...newEntry,
                minStockThreshold: e.target.value,
              })
            }
          />
          <button
            className="bg-green-500 text-white px-4 py-2 rounded"
            onClick={handleAddInventory}
          >
            Add
          </button>
        </div>
      </div>

      {/* Inventory Table */}
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr
            className={`${darkMode ? "bg-gray-700" : "bg-gray-100"} text-left`}
          >
            <th className="border border-gray-300 px-4 py-2">Product</th>
            <th className="border border-gray-300 px-4 py-2">Quantity</th>
            <th className="border border-gray-300 px-4 py-2">
              Minimum Stock Threshold
            </th>
            <th className="border border-gray-300 px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginatedInventory.map((item) => (
            <tr
              key={item.inventoryId}
              className={`text-center ${darkMode ? "bg-gray-700" : "bg-white"}`}
            >
              <td className="border border-gray-300 px-4 py-2">
                {item.product?.name +'_'+ item.product?.quantityPerUnit + item.product?.unit || "N/A"}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {item.stockQuantity}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {item.minStockThreshold}
              </td>
              <td className="border border-gray-300 px-4 py-2 space-x-2">
                <button
                  className="bg-yellow-500 text-white px-3 py-1 rounded"
                  onClick={() => {
                    setEditEntry(item);
                    setShowModal(true);
                  }}
                >
                  Update
                </button>
                <button
                  className="bg-red-600 text-white px-3 py-1 rounded"
                  onClick={() => setDeleteConfirmId(item.inventoryId)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination Controls */}
      <div className="mt-4 flex justify-center gap-2">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => setCurrentPage(i + 1)}
            className={`px-3 py-1 rounded ${
              currentPage === i + 1
                ? "bg-blue-600 text-white"
                : darkMode
                ? "bg-gray-700 text-white"
                : "bg-gray-300 text-black"
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>

      {/* Edit Modal */}
      {showModal && editEntry && (
        <div className="fixed inset-0 bg-[rgba(0,0,0,0.9)] flex justify-center items-center">
          <div className="bg-white dark:bg-gray-800 p-6 rounded shadow-md w-96">
            <h3 className="text-lg font-bold mb-4">Update Inventory</h3>
            <label>Available Quantity</label>
            <input
              type="number"
              value={editEntry.stockQuantity}
              onChange={(e) =>
                setEditEntry({
                  ...editEntry,
                  stockQuantity: e.target.value,
                })
              }
              className="w-full p-2 mb-5 border rounded"
              placeholder="Stock Quantity"
              />
            
            <label>Minimum Threshold</label>
            <input
              type="number"
              value={editEntry.minStockThreshold}
              onChange={(e) =>
                setEditEntry({
                  ...editEntry,
                  minStockThreshold: e.target.value,
                })
              }
              className="w-full p-2 mb-4 border rounded"
              placeholder="Min Stock Threshold"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-500 text-white rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                className="px-4 py-2 bg-green-600 text-white rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteConfirmId && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center">
          <div className="bg-white dark:bg-gray-800 p-6 rounded shadow-md w-96">
            <h3 className="text-lg font-bold mb-4">Confirm Deletion</h3>
            <p className="mb-4">
              Are you sure you want to delete this inventory item?
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 bg-gray-500 text-white rounded"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                className="px-4 py-2 bg-red-600 text-white rounded"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
