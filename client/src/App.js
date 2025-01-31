import React from "react"
import { BrowserRouter } from "react-router-dom"

import { Sidebar } from "./components"

function App() {
  return (
    <div className="flex h-screen items-center justify-center bg-appGradient text-deepBlack">
      <BrowserRouter>
        <div className="bg-[rgba(255, 255, 255, 0.54)] md:grid-cols-1fr grid h-[97%] w-[97%] grid-cols-[11rem_auto_20rem] gap-4 overflow-hidden rounded-2xl lg:grid-cols-[10%_50%_auto] lg:overflow-y-scroll">
          <Sidebar />
        </div>
      </BrowserRouter>
    </div>
  )
}

export default App
