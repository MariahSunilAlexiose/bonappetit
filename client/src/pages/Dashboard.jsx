import React, { useEffect, useState } from "react"

import axios from "axios"

import { Cards, Table } from "../components"

const Dashboard = () => {
  const [inventoryOrders, setInventoryOrders] = useState([])
  useEffect(() => {
    const fetchData = async () => {
      try {
        const invRes = await axios.get("/last_transactions")
        setInventoryOrders(invRes.data)
      } catch (err) {
        console.log(err)
      }
    }

    fetchData()
  }, [])
  return (
    <div className="MainDash gap-5">
      <h1 className="pt-14">Dashboard</h1>
      <Cards />
      <h1 className="pt-7">Last Transactions</h1>
      <div className="pt-7">
        <Table data={inventoryOrders} tableName="inventoryorder" />
      </div>
    </div>
  )
}

export default Dashboard
