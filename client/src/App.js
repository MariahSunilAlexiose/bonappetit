import React from "react"

import { BrowserRouter, Route, Routes } from "react-router-dom"

import { Sidebar } from "./components"
import {
  AddForm,
  Customers,
  Dashboard,
  EditForm,
  Employees,
  Inventory,
  Restaurants,
  Suppliers,
} from "./pages"

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <div className="AppGlass">
          <Sidebar />
          <Routes>
            <Route index element={<Dashboard />} />
            <Route path="/customers" element={<Customers />} />
            <Route path="/employees" element={<Employees />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/restaurants" element={<Restaurants />} />
            <Route path="/suppliers" element={<Suppliers />} />
            <Route path="/add_form" element={<AddForm />} />
            <Route path="/edit_form" element={<EditForm />} />
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  )
}

export default App
