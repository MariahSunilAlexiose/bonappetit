import React, { useEffect, useState } from "react"

import axios from "axios"

import { Table } from "../components"

const CustomerOrders = () => {
  const [orders, setOrders] = useState([])
  const [restaurants, setRestaurants] = useState([])
  const [customers, setCustomers] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const ordersRes = await axios.get("/customerOrders")
        const restaurantsRes = await axios.get("/restaurants")
        const customersRes = await axios.get("/customers")

        setOrders(ordersRes.data)
        setRestaurants(restaurantsRes.data)
        setCustomers(customersRes.data)
      } catch (err) {
        console.log(err)
      }
    }

    fetchData()
  }, [])

  const mapIDToName = (data, idField, nameField) => {
    return data.reduce((map, item) => {
      map[item[idField]] = item[nameField]
      return map
    }, {})
  }

  const customerMap = mapIDToName(customers, "customerID", "name")
  const restaurantMap = mapIDToName(restaurants, "restaurantID", "name")

  const transformedOrders = orders
    .map((order) => ({
      ...order,
      customerID: customerMap[order.customerID] || order.customerID,
      restaurantID: restaurantMap[order.restaurantID] || order.restaurantID,
    }))
    .sort((a, b) => new Date(b.date) - new Date(a.date))

  return (
    <div>
      <h1 className="py-14">Customer Orders</h1>
      <Table data={transformedOrders} />
    </div>
  )
}

export default CustomerOrders
