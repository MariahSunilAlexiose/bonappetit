import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom"

import axios from "axios"

import { formatDate } from "../constants"

const CustomerOrderPage = () => {
  const { customerOrderID } = useParams()
  const [customerOrder, setCustomerOrder] = useState([])
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`/customerorder/${customerOrderID}`)
        setCustomerOrder(res.data[0])
      } catch (err) {
        console.log(err)
      }
    }
    fetchData()
  }, [customerOrderID])
  return (
    <div className="py-14">
      <h1>Customer Order</h1>
      <div className="flex gap-28">
        <div>
          <h2>Customer Name: {customerOrder.customerName}</h2>
          <h2>Restaurant Name: {customerOrder.restaurantName}</h2>
          {customerOrder.date && (
            <h2>Date: {formatDate(customerOrder.date)}</h2>
          )}
        </div>
        <div>
          <h2>Payment Status: {customerOrder.paymentstatus}</h2>
          <h2>Delivery Status: {customerOrder.deliverystatus}</h2>
          <h2>Employee Name: {customerOrder.employeeName}</h2>
        </div>
      </div>
    </div>
  )
}

export default CustomerOrderPage
