import React, { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"

import axios from "axios"

import { PlusIcon } from "../assets/icons"
import { Table } from "../components"

const InventoryItem = () => {
  const navigate = useNavigate()
  const { inventoryItemName } = useParams()
  const [inventoryItem, setInventoryItem] = useState([])
  const [inventoryOrders, setInventoryOrders] = useState([])
  const [allOrders, setAllOrders] = useState([])
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`/get_inventoryItem/${inventoryItemName}`)
        setInventoryItem(res.data[0])
        const invOrders = await axios.get(
          `/get_inventoryorders/${inventoryItem.inventoryID}`
        )
        setInventoryOrders(invOrders.data)
        const orders = await axios.get("/get_inventoryorders")
        setAllOrders(orders.data)
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
      <h2>Restaurant: {inventoryItem.restaurantName}</h2>
      <div className="pt-7">
        <div className="flex justify-between">
          <h1>Inventory Item Orders</h1>
          <button
            className="mr-5 rounded-full bg-green-500 px-2 py-1 font-bold text-white hover:bg-green-700"
            onClick={() => {
              navigate("/add_form", {
                state: {
                  toBeAddedKeys: [
                    "date",
                    "restaurantID",
                    "supplierID",
                    "employeeID",
                    "unitPrice",
                    "quantity",
                    "paymentStatus",
                    "deliveryStatus",
                  ],
                  lastID:
                    allOrders.length > 0
                      ? Math.max(
                          ...allOrders.map((item) => item.inventoryorderID)
                        )
                      : 0,
                  tableName: "inventoryorder",
                  id: inventoryItem.inventoryID,
                },
              })
            }}
          >
            <img alt="Plus Icon" src={PlusIcon} width={20} height={20} />
          </button>
        </div>
        <Table data={inventoryOrders} tableName="inventoryorderitem" />
      </div>
    </div>
  )
}

export default InventoryItem
