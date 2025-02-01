import React, { useEffect, useState } from "react"

import axios from "axios"

import { Table } from "../components"

const Suppliers = () => {
  const [suppliers, setSuppliers] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("/suppliers")
        setSuppliers(res.data)
      } catch (err) {
        console.log(err)
      }
    }
    fetchData()
  }, [])

  return (
    <div className="py-10">
      <div className="flex justify-between">
        <h1>Suppliers</h1>
      </div>
      <div className="pt-7">
        <Table data={suppliers} tableName="supplier" />
      </div>
    </div>
  )
}

export default Suppliers
