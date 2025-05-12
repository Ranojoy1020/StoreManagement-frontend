import { createContext, useState } from "react";

// Create Context
// eslint-disable-next-line react-refresh/only-export-components
export const GlobalContext = createContext({});

// Provider Component
import { ReactNode } from "react";

export const GlobalProvider = ({ children }: { children: ReactNode }) => {
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [sales, setSales] = useState([]);
  const [salesDesc, setSalesDesc] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [udhaar, setsUdhaar] = useState([]);
  const [loading, setLoading] = useState(false); // Example for loading state
  const [error, setError] = useState(null); // Example for error handling
  
  const BACKEND_API_URL = "https://store-management-a8t7.onrender.com/api"; // Example for backend API URL

  // Authentication state
  const [user, setUser] = useState(() => {
    // Load user from localStorage if available
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  }); // Example for authentication

  const login = (userData: {username : string}) => {
    setUser(userData.username);
    localStorage.setItem("user", JSON.stringify(userData.username)); // Save user to localStorage
  } // Example for login function
  
  const logout = async () => {
    await fetch(BACKEND_API_URL + "/admin/logout", {
      method: "POST",
      credentials: "include"
    });
    setUser(null);
    localStorage.removeItem("user"); // Remove user from localStorage
    window.location.href = "/login"; // Redirect to login page
  } // Example for logout function
  
  
  // Dark mode state
  const [darkMode, setDarkMode] = useState(() => {
    const mode = localStorage.getItem("darkMode");
    return mode ? JSON.parse(mode) : true;   // Load theme from localStorage if available else default to dark mode
  }); 
  
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    localStorage.setItem("darkMode", JSON.stringify(!darkMode)); // Save dark mode to localStorage
  } // Example for toggle function

  const fetchCustomers = async () => {
    await fetch(BACKEND_API_URL +"/customers/allCustomers", {
      credentials: "include" // Include credentials for CORS
    })
      .then((res) => res.json())
      .then((data) => {
        setCustomers(data);
      })
      .catch((err) => console.error("Error fetching customers:", err));
  };
  
  const fetchProducts = async () => {
    await fetch(BACKEND_API_URL +"/products/allProducts",{
      credentials: "include" // Include credentials for CORS
    })
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
      })
      .catch((err) => console.error("Error fetching products:", err));
  };
  
  const fetchSales = async () => {
    await fetch(BACKEND_API_URL +"/sales/allSales",{
      credentials: "include" 
    })
      .then((res) => res.json())
      .then((data) => {
        setSales(data);
      })
      .catch((err) => console.error("Error fetching sales:", err));
  };
  
  const fetchSalesDesc = async () => {
    await fetch(BACKEND_API_URL +"/sales/allSalesDesc",{
      credentials: "include" 
    })
      .then((res) => res.json())
      .then((data) => {
        setSalesDesc(data);
      })
      .catch((err) => console.error("Error fetching sales:", err));
  };

  const fetchInventory = async () => {
    await fetch(BACKEND_API_URL +"/inventory/allInventory", {
      credentials: "include" // Include credentials for CORS
    })
      .then((res) => res.json())
      .then((data) => {
        setInventory(data);
      })
      .catch((err) => console.error("Error fetching inventory:", err));
  };
  
  const fetchExpenses = async () => {
    await fetch(BACKEND_API_URL +"/expenses/allExpenses", {
      credentials: "include" // Include credentials for CORS,
    })
      .then((res) => res.json())
      .then((data) => {
        setExpenses(data);
      })
      .catch((err) => console.error("Error fetching expenses:", err));
  };
  
  const fetchSuppliers = async () => {
    await fetch(BACKEND_API_URL +"/supplier/allSuppliers", {
      credentials: "include" // Include credentials for CORS,
    })
      .then((res) => res.json())
      .then((data) => {
        setSuppliers(data);
        console.log(suppliers);
        
      })
      .catch((err) => console.error("Error fetching suppliers:", err));
  };
  
  const fetchUdhaar = async () => {
    await fetch(BACKEND_API_URL +"/udhaar/allUdhaar",{
      credentials: "include" // Include credentials for CORS
    })
      .then((res) => res.json())
      .then((data) => {
        setsUdhaar(data);
      })
      .catch((err) => console.error("Error fetching udhaar:", err));
  };
  
  
  return (
    <GlobalContext.Provider 
      value={{customers, setCustomers, fetchCustomers,
              products, setProducts, fetchProducts,
              sales, setSales, fetchSales,
              salesDesc, setSalesDesc, fetchSalesDesc,
              inventory, setInventory, fetchInventory, 
              expenses, setExpenses, fetchExpenses,
              suppliers, setSuppliers, fetchSuppliers,
              udhaar, setsUdhaar, fetchUdhaar,
              user, login, logout, 
              loading, setLoading, 
              error, setError, 
              darkMode, toggleDarkMode,
              BACKEND_API_URL }}>
      {children}
    </GlobalContext.Provider>
  );
};