import React, { useEffect, useState } from "react"

import axios from "axios"

import { Table } from "../components"

const Customers = () => {
  const [customers, setCustomers] = useState([])
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("/customers")
        setCustomers(res.data)
      } catch (err) {
        console.log(err)
      }
    }

    fetchData()
  }, [])

  return (
    <div className="py-10">
      <div className="flex justify-between">
        <h1>Customers</h1>
      </div>
      <div className="pt-7">
        <Table data={customers} tableName="customer" />
      </div>
    </div>
  )
}

export default Customers
