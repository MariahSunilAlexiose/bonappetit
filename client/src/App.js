import React from "react"

import { createBrowserRouter, RouterProvider } from "react-router-dom"

import { Sidebar } from "./components"
import { Analytics, Dashboard, Employees, Inventory, Orders } from "./pages"

const router = createBrowserRouter([
  {
    path: "/",
    element: <Dashboard />,
  },
  {
    path: "/orders",
    element: <Orders />,
    // children: [
    //   {
    //     path: '/order/:orderID',
    //     element: <OrderPage />,
    //   },
    // ],
  },
  {
    path: "/employees",
    element: <Employees />,
  },
  {
    path: "/inventory",
    element: <Inventory />,
  },
  {
    path: "/analytics",
    element: <Analytics />,
  },
])

function App() {
  return (
    <div className="App">
      <div className="AppGlass">
        <Sidebar />
        <RouterProvider router={router} />
      </div>
    </div>
  )
}

export default App
