import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom"

import axios from "axios"

import { Table } from "../components"

const InventoryItem = () => {
  const { inventoryItemName } = useParams()
  const [inventoryItem, setInventoryItem] = useState([])
  const [inventoryOrders, setInventoryOrders] = useState([])
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`/get_inventoryItem/${inventoryItemName}`)
        setInventoryItem(res.data[0])
        const orders = await axios.get(
          `/get_inventoryorders/${inventoryItem.inventoryID}`
        )
        setInventoryOrders(orders.data)
      } catch (err) {
        console.log(err)
      }
    }

    fetchData()
  }, [inventoryItemName, inventoryItem.inventoryID])

  return (
    <div className="py-14">
      <h1>{inventoryItemName}</h1>
      <h2>Quantity: {inventoryItem.quantity}</h2>
      <h2>Unit Price: {inventoryItem.unitPrice}</h2>
      <h2>Restaurant: {inventoryItem.restaurantName}</h2>
      <h2>Supplier: {inventoryItem.supplierName}</h2>
      <div className="pt-7">
        <div>
          <h1>Inventory Item Orders</h1>
        </div>
        <Table data={inventoryOrders} tableName="inventoryorders" />
      </div>
    </div>
  )
}

export default InventoryItem
