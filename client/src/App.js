import React from "react"

import { BrowserRouter, Route, Routes } from "react-router-dom"

import { Sidebar } from "./components"
import {
  AddForm,
  CustomerOrderPage,
  CustomerPage,
  Customers,
  Dashboard,
  EditForm,
  Employees,
  Inventory,
  InventoryOrderPage,
  RestaurantPage,
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
            <Route
              path="/restaurants/:restaurantName"
              element={<RestaurantPage />}
            />
            <Route
              path="/inventory/inventoryorder/:inventoryOrderID"
              element={<InventoryOrderPage />}
            />
            <Route
              path="/customers/:customer/customerorder/:customerOrderID"
              element={<CustomerOrderPage />}
            />
            <Route path="/customers/:customerName" element={<CustomerPage />} />
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  )
}

export default App
