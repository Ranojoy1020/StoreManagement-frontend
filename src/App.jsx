import './App.css'

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import {BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'

import { Dashboard } from './pages/Dashboard'
import { Login } from './pages/Login'
import { Inventory } from './pages/Inventory'
import { Sales } from './pages/Sales'
import { Sidebar } from './components/Sidebar'

import { GlobalContext } from './context/GlobalContext'
import { useContext } from 'react'
import { Product } from './pages/Product'
import { Customer } from './pages/Customer'
import { Udhaar } from './pages/Udhaar'
import { Expense } from './pages/Expense'
import { Suppliers } from './pages/Suppliers'
import { UpdatePassword } from './pages/UpdatePassword';
import { CreateUser } from './pages/CreateUser';

function App() {
  const { user } = useContext(GlobalContext);

  return (
    <Router>
      {user ? (
        <div className="flex static transition-all duration-500 ease-in-out">
          <Sidebar />
          <div className="w-full">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/products" element={<Product />} />
              <Route path="/sales" element={<Sales />} />
              <Route path="/inventory" element={<Inventory />} />
              <Route path="/customer" element={<Customer />} />
              <Route path="/udhaar" element={<Udhaar />} />
              <Route path="/expense" element={<Expense />} />
              <Route path="/supplier" element={<Suppliers />} />
              <Route path="/update-password" element={<UpdatePassword />} />
              <Route path="/create-user" element={<CreateUser />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </div>
        </div>
      ) : (
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      )}
      <ToastContainer 
       position="top-right"
       autoClose={3000}
       hideProgressBar={false}
       newestOnTop={true}
       closeOnClick
       pauseOnHover
       theme="colored"
       />
    </Router>
  )
}

export default App
