import { useContext, useEffect, useState } from "react";
import { GlobalContext } from "../context/GlobalContext";
import axios from "axios";

export const Suppliers = () => {
  const { 
    darkMode,
    suppliers,
    fetchSuppliers,
    loading,
    setLoading,
    BACKEND_API_URL,
   } = useContext(GlobalContext);
  const [isOpen, setIsOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    contact: "",
    email: "",
    address: "",
  });


  useEffect(() => {
    fetchSuppliers();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post(BACKEND_API_URL + "/supplier/addSupplier", formData, { headers: { "Content-Type": "application/json"}, withCredentials: true })
      .then(() => {
        fetchSuppliers(); // Refresh list
        setFormData({ name: "", contact: "", email:"", address: "" });
      })
      .catch((error) => console.error("Error adding supplier:", error));
  };

  return (
    <div className={`p-4 min-h-screen ${darkMode ? "bg-gray-800 text-white" : "bg-gray-100 text-black"}`}>
      <h1 className="text-3xl font-bold mb-4">Supplier Management</h1>
      <button className="bg-blue-500 p-1 rounded-full m-1 float-right" 
      onClick={() => {setIsOpen((prev) => !prev)}}>{isOpen ? "Hide Form" : "Add Supplier"} 
      </button>

      {/* Add Supplier Form */}
      {isOpen && (
        <form onSubmit={handleSubmit} className= "mb-6 space-y-4 bg-blue-500 shadow-md rounded p-4 transition-transform ease 500ms">
        <div>
          <label className="block mb-1 font-semibold">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block mb-1 font-semibold">Contact</label>
          <input
            type="text"
            name="contact"
            value={formData.contact}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block mb-1 font-semibold">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block mb-1 font-semibold">Address</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Add Supplier
        </button>
      </form>
      )}
      

      {/* Supplier List Table */}
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-600 text-white">
            <th className="border p-2">#</th>
            <th className="border p-2">Name</th>
            <th className="border p-2">Contact</th>
            <th className="border p-2">Email</th>
            <th className="border p-2">Address</th>
          </tr>
        </thead>
        <tbody>
          {suppliers.map((supplier) => (
            <tr key={supplier?.supplierId} className="text-center border-b">
              <td className="border p-2">{supplier?.supplierId}</td>
              <td className="border p-2">{supplier.name}</td>
              <td className="border p-2">{supplier.contact}</td>
              <td className="border p-2">{supplier.email}</td>
              <td className="border p-2">{supplier.address}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
