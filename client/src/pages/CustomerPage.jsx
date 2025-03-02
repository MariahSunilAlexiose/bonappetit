import React, { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"

import axios from "axios"

import { PlusIcon } from "../assets/icons"
import { Table } from "../components"

const CustomerPage = () => {
  const navigate = useNavigate()
  const { customerName } = useParams()
  const [customer, setCustomer] = useState({})
  const [orders, setOrders] = useState([])
  const [lastID, setLastID] = useState(0)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`/get_customer/${customerName}`)
        setCustomer(res.data[0])
        const resOrders = await axios.get(
          `/customerorders/${res.data[0].customerID}`
        )
        setOrders(resOrders.data)
        const totalNo = await axios.get("/customerorders")
        setLastID(
          totalNo.data.length > 0
            ? Math.max(...totalNo.data.map((item) => item.customerorderID))
            : 0
        )
      } catch (err) {
        console.log(err)
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
        <button
          className="mr-5 rounded-full bg-green-500 px-2 py-1 font-bold text-white hover:bg-green-700"
          onClick={() => {
            navigate("/add_form", {
              state: {
                toBeAddedKeys: [
                  "customerID",
                  "date",
                  "restaurantID",
                  "employeeID",
                  "paymentStatus",
                  "deliveryStatus",
                ],
                lastID: lastID,
                tableName: "customerorder",
                id: customer.customerID,
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
