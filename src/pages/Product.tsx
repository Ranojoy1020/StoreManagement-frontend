import React, { useState, useEffect, useContext } from "react";
import { GlobalContext } from "../context/GlobalContext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Loading } from "../components/Loading";

export const Product = () => {
  const {
    darkMode,
    loading,
    setLoading,
    error,
    products,
    setProducts,
    fetchProducts,
  } = useContext<{ darkMode: boolean; loading: boolean; error: string }>(
    GlobalContext
  );

  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    category: "",
    quantityPerUnit: "",
    unit: "KG",
  });

  const [editIndex, setEditIndex] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [filterCategory, setFilterCategory] = useState("All");
  const [recordsPerPage, setRecordsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);

  const filteredProducts =
    filterCategory === "All"
      ? products
      : products.filter((p) => p.category === filterCategory);

  const totalPages = Math.ceil(filteredProducts.length / recordsPerPage);
  const currentProducts = filteredProducts.slice(
    (currentPage - 1) * recordsPerPage,
    currentPage * recordsPerPage
  );

  useEffect(() => {
    setLoading(true);
    fetchProducts();
    setLoading(false);
  }, []);

  const handleAddProduct = () => {
    if (!newProduct.name || !newProduct.price || !newProduct.category) {
      toast.error("All fields are required!");
      return;
    }

    const method = editIndex !== null ? "PUT" : "POST";
    const url =
      method === "POST"
        ? "http://localhost:8080/api/products/addProduct"
        : `http://localhost:8080/api/products/updateProduct/${products[editIndex].productId}`;

    fetch(url, {
      method,
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newProduct),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Request failed");
        return res.json();
      })
      .then((data) => {
        const updated = [...products];
        if (editIndex !== null) {
          updated[editIndex] = data;
          toast.success("Product updated");
        } else {
          updated.push(data);
          toast.success("Product added");
        }
        setProducts(updated);
        resetForm();
      })
      .catch(() => toast.error("Failed to add or update product"));
  };

  const resetForm = () => {
    setNewProduct({
      name: "",
      price: "",
      category: "",
      quantityPerUnit: "",
      unit: "KG",
    });
    setEditIndex(null);
    setShowModal(false);
  };

  const handleEdit = (index: string | number | React.SetStateAction<null>) => {
    setNewProduct(products[index]);
    setEditIndex(index);
    setShowModal(true);
  };

  const handleDelete = (productId : number) => {
    fetch(`http://localhost:8080/api/products/deleteProduct/${productId}`, {
      method: "DELETE",
    })
      .then((res) => {
        if (!res.ok) throw new Error();
        toast.success("Product deleted");
        setProducts(products.filter((p) => p.productId !== productId));
      })
      .catch(() => toast.error("Delete failed"));
  };

  return (
    <div
      className={`p-6 min-h-screen ${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-black"
      }`}
    >
      <h1 className="text-3xl font-bold mb-4">Product Management</h1>

      <button
        onClick={() => {
          setEditIndex(null);
          setNewProduct({
            name: "",
            price: "",
            category: "",
            quantityPerUnit: "",
            unit: "KG",
          });
          setShowModal(true);
        }}
        className="mb-4 px-4 py-2 bg-blue-600 text-white rounded"
      >
        Add Product
      </button>

      {/* Filters */}
      <div className="mb-4 flex items-center justify-between dark:bg-gray-700 p-4 rounded text-white">
        <div>
          <label className="mr-2 font-medium">Filter by Category:</label>
          <select
            className="p-2 rounded dark:bg-gray-600 text-white"
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
          >
            <option value="All">All</option>
            {[...new Set(products.map((p) => p.category))].map((cat) => (
              <option key={cat}>{cat}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="mr-2 font-medium">Records per page:</label>
          <select
            className="p-2 rounded dark:bg-gray-600 text-white"
            value={recordsPerPage}
            onChange={(e) => setRecordsPerPage(Number(e.target.value))}
          >
            {[5, 10, 15, 20].map((num) => (
              <option key={num}>{num}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Loader / Error */}
      {loading && <Loading />}
      {error && <div className="text-red-500 text-center">{error}</div>}

      {/* Product Table */}
      {!loading && !error && (
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr
              className={`${
                darkMode ? "bg-gray-700" : "bg-gray-300"
              } text-left`}
            >
              <th className="p-2 border">Product</th>
              <th className="p-2 border">Price</th>
              <th className="p-2 border">Category</th>
              <th className="p-2 border">Qty/Unit</th>
              <th className="p-2 border">Unit</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentProducts.map(
              (
                item: {
                  productId: React.Key | null | undefined;
                  name:
                    | string
                    | number
                    | bigint
                    | boolean
                    | React.ReactElement<
                        unknown,
                        string | React.JSXElementConstructor<any>
                      >
                    | Iterable<React.ReactNode>
                    | React.ReactPortal
                    | Promise<
                        | string
                        | number
                        | bigint
                        | boolean
                        | React.ReactPortal
                        | React.ReactElement<
                            unknown,
                            string | React.JSXElementConstructor<any>
                          >
                        | Iterable<React.ReactNode>
                        | null
                        | undefined
                      >
                    | null
                    | undefined;
                  price:
                    | string
                    | number
                    | bigint
                    | boolean
                    | React.ReactElement<
                        unknown,
                        string | React.JSXElementConstructor<any>
                      >
                    | Iterable<React.ReactNode>
                    | React.ReactPortal
                    | Promise<
                        | string
                        | number
                        | bigint
                        | boolean
                        | React.ReactPortal
                        | React.ReactElement<
                            unknown,
                            string | React.JSXElementConstructor<any>
                          >
                        | Iterable<React.ReactNode>
                        | null
                        | undefined
                      >
                    | null
                    | undefined;
                  category:
                    | string
                    | number
                    | bigint
                    | boolean
                    | React.ReactElement<
                        unknown,
                        string | React.JSXElementConstructor<any>
                      >
                    | Iterable<React.ReactNode>
                    | React.ReactPortal
                    | Promise<
                        | string
                        | number
                        | bigint
                        | boolean
                        | React.ReactPortal
                        | React.ReactElement<
                            unknown,
                            string | React.JSXElementConstructor<any>
                          >
                        | Iterable<React.ReactNode>
                        | null
                        | undefined
                      >
                    | null
                    | undefined;
                  quantityPerUnit:
                    | string
                    | number
                    | bigint
                    | boolean
                    | React.ReactElement<
                        unknown,
                        string | React.JSXElementConstructor<any>
                      >
                    | Iterable<React.ReactNode>
                    | React.ReactPortal
                    | Promise<
                        | string
                        | number
                        | bigint
                        | boolean
                        | React.ReactPortal
                        | React.ReactElement<
                            unknown,
                            string | React.JSXElementConstructor<any>
                          >
                        | Iterable<React.ReactNode>
                        | null
                        | undefined
                      >
                    | null
                    | undefined;
                  unit:
                    | string
                    | number
                    | bigint
                    | boolean
                    | React.ReactElement<
                        unknown,
                        string | React.JSXElementConstructor<any>
                      >
                    | Iterable<React.ReactNode>
                    | React.ReactPortal
                    | Promise<
                        | string
                        | number
                        | bigint
                        | boolean
                        | React.ReactPortal
                        | React.ReactElement<
                            unknown,
                            string | React.JSXElementConstructor<any>
                          >
                        | Iterable<React.ReactNode>
                        | null
                        | undefined
                      >
                    | null
                    | undefined;
                },
                index: any
              ) => (
                <tr
                  key={item.productId}
                  className={darkMode ? "bg-gray-800" : "bg-white"}
                >
                  <td className="p-2 border">{item.name}</td>
                  <td className="p-2 border">₹{item.price}</td>
                  <td className="p-2 border">{item.category}</td>
                  <td className="p-2 border">{item.quantityPerUnit}</td>
                  <td className="p-2 border">{item.unit}</td>
                  <td className="p-2 border">
                    <button
                      className="bg-yellow-400 px-3 py-1 rounded mr-2"
                      onClick={() => handleEdit(products.indexOf(item))}
                    >
                      Edit
                    </button>
                    <button
                      className="bg-red-500 px-3 py-1 text-white rounded"
                      onClick={() => handleDelete(item.productId)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      )}

      {/* Pagination */}
      <div className="flex justify-center mt-4 gap-2">
        <button
          className="bg-gray-500 text-white px-4 py-1 rounded"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => prev - 1)}
        >
          Prev
        </button>
        <span className="px-4 py-1 font-semibold">
          {currentPage} / {totalPages}
        </span>
        <button
          className="bg-gray-500 text-white px-4 py-1 rounded"
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((prev) => prev + 1)}
        >
          Next
        </button>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center dark:bg-gray-900 bg-opacity-50">
          <div
            className={`bg-white p-6 rounded shadow-md w-full max-w-xl ${
              darkMode ? "bg-gray-800 text-white" : ""
            }`}
          >
            <h2 className="text-xl font-semibold mb-4 dark:text-black">
              {editIndex !== null ? "Edit Product" : "Add New Product"}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Product Name"
                className="p-2 rounded text-black border"
                value={newProduct.name}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, name: e.target.value })
                }
              />
              <input
                type="number"
                placeholder="Price"
                className="p-2 rounded text-black border"
                value={newProduct.price}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, price: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="Category"
                className="p-2 rounded text-black border"
                value={newProduct.category}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, category: e.target.value })
                }
              />
              <input
                type="number"
                placeholder="Quantity/Unit"
                className="p-2 rounded text-black border"
                value={newProduct.quantityPerUnit}
                onChange={(e) =>
                  setNewProduct({
                    ...newProduct,
                    quantityPerUnit: e.target.value,
                  })
                }
              />
              <select
                value={newProduct.unit}
                className="p-2 rounded text-black border"
                onChange={(e) =>
                  setNewProduct({ ...newProduct, unit: e.target.value })
                }
              >
                <option value="KG">KG</option>
                <option value="GRAM">GRAM</option>
                <option value="LITRE">LITRE</option>
                <option value="ML">ML</option>
                <option value="PIECE">PIECE</option>
                <option value="PACKET">PACKET</option>
              </select>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={resetForm}
                className="px-4 py-2 bg-gray-500 text-white rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleAddProduct}
                className="px-4 py-2 bg-green-600 text-white rounded"
              >
                {editIndex !== null ? "Update" : "Add"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
