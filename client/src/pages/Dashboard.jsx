import React from "react"

import { Cards } from "../components"

const Dashboard = () => {
  return (
    <div className="MainDash gap-5">
      <h1 className="pt-14">Dashboard</h1>
      <Cards />
      <h2>Last Transactions</h2>
    </div>
  )
}

export default Dashboard
