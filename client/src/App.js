import React, { useEffect, useState } from "react"

import axios from "axios"

import { Logo } from "./assets/icons"

function App() {
  const [data, setData] = useState([])
  useEffect(() => {
    axios
      .get("/customers")
      .then((res) => {
        setData(res.data)
      })
      .catch((err) => console.log(err))
  }, [])
  console.log(data)
  return (
    <div className="text-center">
      <header className="bg-[#282c34] min-h-screen flex flex-col items-center justify-center text-[calc(10px_+_2vmin)] text-white">
        <img
          src={Logo}
          className="h-[40vmin] pointer-events-none motion-safe:animate-[App-logo-spin_infinite_20s_linear]"
          alt="logo"
        />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="text-[#61dafb]"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  )
}

export default App
