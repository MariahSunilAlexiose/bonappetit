import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom"

import axios from "axios"

const InventoryItem = () => {
  const { inventoryItemName } = useParams()
  const [inventoryItem, setInventoryItem] = useState([])
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`/get_inventoryItem/${inventoryItemName}`)
        console.log(res.data[0])
        setInventoryItem(res.data[0])
      } catch (err) {
        console.log(err)
      }
    }

    fetchData()
  }, [inventoryItemName])

  return (
    <div className="py-14">
      <h1>{inventoryItemName}</h1>
      <h2>Quantity: {inventoryItem.quantity}</h2>
      <h2>Unit Price: {inventoryItem.unitPrice}</h2>
      <h2>Restaurant: {inventoryItem.restaurantName}</h2>
      <h2>Supplier: {inventoryItem.supplierName}</h2>
    </div>
  )
}

export default InventoryItem
