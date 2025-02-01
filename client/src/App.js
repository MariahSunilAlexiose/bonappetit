import React from "react"
import { BrowserRouter, Route, Routes } from "react-router-dom"

import { Sidebar } from "./components"
import { Restaurants } from "./pages"

function App() {
  return (
    <div className="flex h-screen items-center justify-center bg-appGradient text-deepBlack">
      <BrowserRouter>
        <div className="bg-[rgba(255, 255, 255, 0.54)] md:grid-cols-1fr grid h-[97%] w-[97%] grid-cols-[11rem_auto] gap-4 overflow-hidden rounded-2xl lg:grid-cols-[15%_85%] lg:overflow-y-scroll">
          <Sidebar />
          <Routes>
            <Route path="/restaurants" element={<Restaurants />} />
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  )
}

export default App
