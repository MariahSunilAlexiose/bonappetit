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
  RestaurantPage,
  Restaurants,
} from "./pages"

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <div className="AppGlass">
          <Sidebar />
          <Routes>
            <Route index element={<Dashboard />} />
            <Route path="/restaurants" element={<Restaurants />} />
            <Route path="/add_form" element={<AddForm />} />
            <Route
              path="/restaurants/:restaurantName"
              element={<RestaurantPage />}
            />
            <Route path="/edit_form" element={<EditForm />} />
            <Route path="/customers" element={<Customers />} />
            <Route path="/customers/:customerName" element={<CustomerPage />} />
            <Route
              path="/customers/:customer/:customerorderID"
              element={<CustomerOrderPage />}
            />
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  )
}

export default App
