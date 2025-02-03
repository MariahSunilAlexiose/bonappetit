import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom"

import axios from "axios"

import { Table } from "../components"
import { formatDate } from "../constants"

const CustomerOrder = () => {
  const { customerorderID } = useParams()
  const [customerOrder, setCustomerOrder] = useState([])
  const [customerOrderItems, setCustomerOrderItems] = useState([])
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`/customerorder/${customerorderID}`)
        setCustomerOrder(res.data[0])
        const resItems = await axios.get(
          `/get_customerorderitems/${customerorderID}`
        )
        setCustomerOrderItems(resItems.data)
      } catch (err) {
        console.log(err)
      }
    }
    fetchData()
  }, [customerorderID])
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
      <div className="pt-7">
        <div>
          <h1>Customer Order Details</h1>
        </div>
        <Table data={customerOrderItems} tableName="customerorderitem" />
      </div>
    </div>
  )
}

export default CustomerOrder
