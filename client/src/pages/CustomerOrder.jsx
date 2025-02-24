import React, { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"

import axios from "axios"

import { PlusIcon } from "../assets/icons"
import { Table } from "../components"
import { formatDate } from "../constants"

const CustomerOrder = () => {
  const navigate = useNavigate()
  const { orderID } = useParams()
  const [customerOrder, setCustomerOrder] = useState([])
  const [customerOrderItems, setCustomerOrderItems] = useState([])
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`/customerorder/${orderID}`)
        setCustomerOrder(res.data[0])
        const resItems = await axios.get(`/get_customerorderitems/${orderID}`)
        setCustomerOrderItems(resItems.data)
      } catch (err) {
        console.log(err)
      }
    }
    fetchData()
  }, [orderID])
  return (
    <div className="py-14">
      <h1>Customer Order</h1>
      <div className="flex gap-28">
        <div>
          {customerOrder.date && (
            <h2>Date: {formatDate(customerOrder.date)}</h2>
          )}
          <h2>Customer Name: {customerOrder.customerName}</h2>
          <h2>Restaurant Name: {customerOrder.restaurantName}</h2>
        </div>
        <div>
          <h2>Employee Name: {customerOrder.employeeName}</h2>
          <h2>Payment Status: {customerOrder.paymentStatus}</h2>
          <h2>Delivery Status: {customerOrder.deliveryStatus}</h2>
        </div>
      </div>
      <div className="pt-7">
        <div className="flex justify-between">
          <h1>Customer Order Details</h1>
          <button
            className="mr-5 rounded-full bg-green-500 px-2 py-1 font-bold text-white hover:bg-green-700"
            onClick={() => {
              navigate("/add_form", {
                state: {
                  toBeAddedKeys: Object.keys(customerOrderItems[0]).filter(
                    (key) => key !== "customerorderID" && key !== "menuitemID"
                  ),
                  tableName: "customerorderitem",
                  id: orderID,
                },
              })
            }}
          >
            <img alt="Plus Icon" src={PlusIcon} width={20} height={20} />
          </button>
        </div>
        <Table data={customerOrderItems} tableName="customerorderitem" />
      </div>
    </div>
  )
}

export default CustomerOrder
