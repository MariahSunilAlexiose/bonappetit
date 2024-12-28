import React from "react"

import { BrowserRouter, Route, Routes } from "react-router-dom"

import { Sidebar } from "./components"
import {
  Dashboard,
} from "./pages"

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <div className="AppGlass">
          <Sidebar />
          <Routes>
            <Route index element={<Dashboard />} />
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  )
}

export default App
