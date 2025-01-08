import React, { useEffect, useState } from "react"

import axios from "axios"
import { useNavigate, useParams } from "react-router-dom"

import { PlusIcon } from "../assets/icons"
import { Table } from "../components"

const handleDelete = async (id, navigate) => {
  try {
    await axios.delete(`/delete_customerorder/${id}`)
    navigate(-1)
  } catch (err) {
    console.log("Error deleting data:", err)
  }
}

const formatDate = (isoDate) => {
  // Parse the ISO 8601 date string
  const dateObject = new Date(isoDate) // Format the date as "day month year"
  const options = { day: "2-digit", month: "long", year: "numeric" }
  const formattedDate = dateObject.toLocaleDateString("en-US", options)
  return formattedDate
}

const CustomerOrderPage = () => {
  const navigate = useNavigate()
  const { customerorderID } = useParams()
  const [order, setOrder] = useState([])
  const [items, setItems] = useState([])
  const [restaurant, setRestaurant] = useState("")
  const [customer, setCustomer] = useState("")
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`/get_customerorder/${customerorderID}`)
        setOrder(res.data[0])
        const resName = await axios.get(
          `/get_restaurant_name/${res.data[0].restaurantID}`
        )
        setRestaurant(resName.data[0].name)
        const cusName = await axios.get(
          `/get_customer_name/${res.data[0].customerID}`
        )
        setCustomer(cusName.data[0].name)
        const resItems = await axios.get(
          `/customerorderitems/${customerorderID}`
        )
        setItems(resItems.data)
      } catch (err) {
        console.log(err)
      }
    }
    fetchData()
  }, [customerorderID])
  return (
    <div className="py-14">
      <div className="flex justify-between">
        <div>
          <h1>Customer Order</h1>
          <div className="flex gap-60">
            <div>
              <h2>Order ID: {order.customerorderID}</h2>
              <h2>Restaurant: {restaurant}</h2>
              <h2>Customer: {customer}</h2>
            </div>
            <div>
              <h2>Payment Status: {order.paymentStatus}</h2>
              <h2>Delivery Status: {order.deliveryStatus}</h2>
              <h2>Date: {formatDate(order.date)}</h2>
            </div>
          </div>
        </div>
        <div>
          <button
            onClick={(e) => {
              e.stopPropagation()
              navigate("/edit_form", {
                state: {
                  tableName: "customerorder",
                  dataToBeUpdated: order,
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
              handleDelete(order.customerorderID, navigate)
            }}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
          >
            Delete
          </button>
        </div>
      </div>
      <br />
      <div className="flex justify-between">
        <h1>Order Items</h1>
        <button
          className="mr-1 bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded-full"
          onClick={() => {
            const keysToPass = items.length > 0
              ? Object.keys(items[0]).filter(
                  (key) => key !== "customerorderID"
                )
              : ["menuitemName", "quantity"];            
            navigate("/add_form", {
              state: {
                toBeAddedKeys: keysToPass,
                lastID: customerorderID,
                tableName: "customerorderitem",
                // fromId: menu.length > 0 ? menu[0].restaurantID : restaurant.restaurantID, 
              },
            });
          }}
        >
          <img alt="Plus Icon" src={PlusIcon} width={20} height={20} />
        </button>
      </div>
      <Table data={items} tableName="customerorderitem" />
    </div>
  )
}

export default CustomerOrderPage
