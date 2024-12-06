import React, { useEffect, useState } from "react"

import axios from "axios"
import { useNavigate } from "react-router-dom"

import { PlusIcon } from "../assets/icons"
import { Table } from "../components"

const Inventory = () => {
  const navigate = useNavigate()
  const [inventory, setInventory] = useState([])
  useEffect(() => {
    const fetchAndReplaceRestaurantNames = async () => {
      try {
        const res = await axios.get("/inventory")
        const restID = await axios.get("/restaurants")
        const suppID = await axios.get("/suppliers")

        const restIDMapping = {}
        restID.data.forEach((restaurant) => {
          restIDMapping[restaurant.restaurantID] = restaurant.name
        })

        const suppIDMapping = {}
        suppID.data.forEach((supplier) => {
          suppIDMapping[supplier.supplierID] = supplier.name
        })

        const updatedInventory = res.data.map((item) => {
          const { restaurantID, supplierID, ...rest } = item // eslint-disable-line no-unused-vars
          return {
            ...rest,
            restaurantName:
              restIDMapping[item.restaurantID] || item.restaurantID,
            supplierName: suppIDMapping[item.supplierID] || item.supplierID,
          }
        })

        setInventory(updatedInventory)
      } catch (err) {
        console.log(err)
      }
    }

    fetchAndReplaceRestaurantNames()
  }, [])
  const lastID = Math.max(...inventory.map((item) => item.inventoryID))
  let toBeUpdatedKeys = []
  let tableName = "inventory"

  if (inventory && inventory.length > 0) {
    toBeUpdatedKeys = Object.keys(inventory[0]).filter(
      (key) =>
        key !== "inventoryID" &&
        key !== "restaurantName" &&
        key !== "supplierName"
    )
  }
  return (
    <div className="py-10">
      <div className="flex justify-between">
        <h1>Inventory</h1>
        <button
          className="mr-1 bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded-full"
          onClick={() =>
            navigate("/add_form", {
              state: { toBeUpdatedKeys, lastID, tableName },
            })
          }
        >
          <img alt="Plus Icon" src={PlusIcon} width={20} height={20} />
        </button>
      </div>
      <div className="pt-7">
        <Table data={inventory} tableName="inventory" />
      </div>
    </div>
  )
}

export default Inventory
