import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom"

import axios from "axios"

import { Table } from "../components"

const CustomerPage = () => {
  const { customerName } = useParams()
  const [customer, setCustomer] = useState({})
  const [orders, setOrders] = useState([])
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`/get_customer/${customerName}`)
        setCustomer(res.data[0])
        const resOrders = await axios.get(
          `/customerorders/${res.data[0].customerID}`
        )
        setOrders(resOrders.data)
      } catch (err) {
        console.log("Error fetching orders:", err)
      }
    }
    fetchData()
  }, [customerName])

  return (
    <div className="py-14">
      <h1>{customerName}</h1>
      <h2>Address: {customer.address}</h2>
      <h2>Phone: {customer.phone}</h2>
      <h2>Email: {customer.email}</h2>
      <br />
      <div className="flex justify-between">
        <h1>Customer Order</h1>
      </div>
      <Table data={orders} tableName="customerorder" />
    </div>
  )
}

export default CustomerPage
