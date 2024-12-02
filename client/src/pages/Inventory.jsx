import React, { useEffect, useState } from "react"

import axios from "axios"

import { Table } from "../components"

const Inventory = () => {
  const [items, setItems] = useState([])
  const [restaurants, setRestaurants] = useState([])
  useEffect(() => {
    const fetchData = async () => {
      try {
        const itemsRes = await axios.get("/inventory")
        const restaurantsRes = await axios.get("/restaurants")
        setItems(itemsRes.data)
        setRestaurants(restaurantsRes.data)
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
  const restaurantMap = mapIDToName(restaurants, "restaurantID", "name")
  const transformedOrders = items.map((item) => ({
    ...item,
    restaurantID: restaurantMap[item.restaurantID] || item.restaurantID,
  }))
  return (
    <div>
      <h1 className="py-14">Inventory</h1>
      <Table data={transformedOrders} />
    </div>
  )
}

export default Inventory
