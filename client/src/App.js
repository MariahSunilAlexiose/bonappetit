import React from "react"

import { BrowserRouter, Route, Routes } from "react-router-dom"

import { Sidebar } from "./components"
import {
  Analytics,
  CustomerOrders,
  Dashboard,
  Employees,
  Inventory,
} from "./pages"

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <div className="AppGlass">
          <Sidebar />
          <Routes>
            <Route index element={<Dashboard />} />
            <Route path="/employees" element={<Employees />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/customerOrders" element={<CustomerOrders />} />
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  )
}

export default App
