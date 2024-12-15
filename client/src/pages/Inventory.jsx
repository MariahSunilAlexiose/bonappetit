import React, { useEffect, useState } from "react"

import axios from "axios"
import { useNavigate } from "react-router-dom"

import { PlusIcon } from "../assets/icons"
import { Table } from "../components"

const Inventory = () => {
  const navigate = useNavigate()
  const [inventory, setInventory] = useState([])
  const [inventoryOrders, setInventoryOrders] = useState([])
  const [total, setTotal] = useState(0)
  useEffect(() => {
    const fetchAndReplaceRestaurantNames = async () => {
      try {
        const res = await axios.get("/inventory_view")
        setInventory(res.data)

        const invRes = await axios.get("/inventoryorders_view")
        setInventoryOrders(invRes.data)

        const count = await axios.get("/count_inventoryorders")
        setTotal(count.data[0].total)
      } catch (err) {
        console.log(err)
      }
    }

    fetchAndReplaceRestaurantNames()
  }, [])
  return (
    <div className="py-10">
      <div className="flex justify-between">
        <h1>Inventory</h1>
        <button
          className="mr-1 bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded-full"
          onClick={() =>
            navigate("/add_form", {
              state: {
                toBeAddedKeys: Object.keys(inventory[0]).filter(
                  (key) =>
                    key !== "inventoryID" &&
                    key !== "restaurantName" &&
                    key !== "supplierName"
                ),
                lastID: Math.max(...inventory.map((item) => item.inventoryID)),
                tableName: "inventory",
              },
            })
          }
        >
          <img alt="Plus Icon" src={PlusIcon} width={20} height={20} />
        </button>
      </div>
      <div className="pt-7">
        <Table data={inventory} tableName="inventory" />
      </div>
      <div className="flex justify-between">
        <h1>Inventory Order</h1>
        <button
          className="mr-1 bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded-full"
          onClick={() => {
            navigate("/add_form", {
              state: {
                toBeAddedKeys: [],
                lastID: total,
                tableName: "inventoryorder",
                id: inventory.inventoryID,
              },
            })
          }}
        >
          <img alt="Plus Icon" src={PlusIcon} width={20} height={20} />
        </button>
      </div>
      <div className="pt-7">
        <Table data={inventoryOrders} tableName="inventoryorder" />
      </div>
    </div>
  )
}

export default Inventory
