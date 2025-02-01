import React, { useEffect, useState } from "react"

import axios from "axios"

import { Table } from "../components"

const Inventory = () => {
  const [inventory, setInventory] = useState([])
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("/inventory")
        setInventory(res.data)
      } catch (err) {
        console.log(err)
      }
    }

    fetchData()
  }, [])

  return (
    <div className="py-10">
      <div className="flex justify-between">
        <h1>Inventory</h1>
      </div>
      <div className="pt-7">
        <Table data={inventory} tableName="inventory" />
      </div>
    </div>
  )
}

export default Inventory
