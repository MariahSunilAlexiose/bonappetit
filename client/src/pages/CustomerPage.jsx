import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom"

import axios from "axios"

const CustomerPage = () => {
  const { customerName } = useParams()
  const [customer, setCustomer] = useState({})
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`/get_customer/${customerName}`)
        setCustomer(res.data[0])
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
    </div>
  )
}

export default CustomerPage
