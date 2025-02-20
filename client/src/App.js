import React from "react"
import { BrowserRouter, Route, Routes } from "react-router-dom"

import { Sidebar } from "./components"
import {
  CustomerOrder,
  CustomerPage,
  Customers,
  EmployeePage,
  Employees,
  Inventory,
  InventoryItem,
  RestaurantPage,
  Restaurants,
  SupplierOrder,
  SupplierPage,
  Suppliers,
} from "./pages"

function App() {
  return (
    <div className="flex h-screen items-center justify-center bg-appGradient text-deepBlack">
      <BrowserRouter>
        <div className="bg-[rgba(255, 255, 255, 0.54)] md:grid-cols-1fr grid h-[97%] w-[97%] grid-cols-[11rem_auto] gap-4 overflow-hidden rounded-2xl lg:grid-cols-[15%_85%] lg:overflow-y-scroll">
          <Sidebar />
          <Routes>
            <Route path="/restaurants" element={<Restaurants />} />
            <Route path="/customers" element={<Customers />} />
            <Route path="/employees" element={<Employees />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/suppliers" element={<Suppliers />} />
            <Route
              path="/restaurants/:restaurantName"
              element={<RestaurantPage />}
            />
            <Route path="/customers/:customerName" element={<CustomerPage />} />
            <Route
              path="/customers/:customer/customerorder/:customerorderID"
              element={<CustomerOrder />}
            />
            <Route path="/employees/:employeeName" element={<EmployeePage />} />
            <Route
              path="/employees/:employeeName/customerorder/:customerorderID"
              element={<CustomerOrder />}
            />
            <Route
              path="/inventory/:inventoryItemName"
              element={<InventoryItem />}
            />
            <Route path="/suppliers/:supplierName" element={<SupplierPage />} />
            <Route
              path="/suppliers/:supplierName/order/:orderID"
              element={<SupplierOrder />}
            />
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  )
}

export default App
