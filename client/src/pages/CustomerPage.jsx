import React, { useEffect, useState } from "react"

import axios from "axios"
import { useNavigate, useParams } from "react-router-dom"

import { PlusIcon } from "../assets/icons"
import { Table } from "../components"

const handleDelete = async (id, navigate) => {
  try {
    await axios.delete(`/delete_customer/${id}`)
    navigate(-1)
  } catch (err) {
    console.log("Error deleting data:", err)
  }
}

const CustomerPage = () => {
  const { customerName } = useParams()
  const navigate = useNavigate()
  const [customer, setCustomer] = useState({})
  const [orders, setOrders] = useState([])
  const [lastID, setLastID] = useState(0)
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`/get_customer/${customerName}`)
        setCustomer(res.data)
        const totalNo = await axios.get("/customerorders")
        setLastID(Math.max(...totalNo.data.map((item) => item.customerorderID)))
        const resOrders = await axios.get(
          `/get_customerorders/${res.data.customerID}`
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
      <div className="flex justify-between">
        <div>
          <h1>{customerName}</h1>
          <h2>Address: {customer.address}</h2>
          <h2>Phone: {customer.phone}</h2>
          <h2>Email: {customer.email}</h2>
        </div>
        <div>
          <button
            onClick={(e) => {
              e.stopPropagation()
              navigate("/edit_form", {
                state: {
                  tableName: "customer",
                  dataToBeUpdated: customer,
                },
              })
            }}
            className="mr-1 bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded"
          >
            Edit
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation()
              handleDelete(customer.customerID, navigate)
            }}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
          >
            Delete
          </button>
        </div>
      </div>
      <br />

      <div className="flex justify-between">
        <h1>Orders</h1>
        <button
          className="mr-1 bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded-full"
          onClick={() => {
            const keysToPass = orders.length > 0
              ? Object.keys(orders[0]).filter(
                (key) => key !== "customerorderID" && key !== "customerID"
                )
              : ["restaurantName", "date", "paymentStatus", "deliveryStatus"]; 
            navigate("/add_form", {
              state: {
                toBeAddedKeys: keysToPass,
                lastID: lastID,
                tableName: "customerorder",
                fromId: customer.customerID,
              },
            })
          }}
        >
          <img alt="Plus Icon" src={PlusIcon} width={20} height={20} />
        </button>
      </div>
      <Table data={orders} tableName="customerorder" />
    </div>
  )
}

export default CustomerPage
