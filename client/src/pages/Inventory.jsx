import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

import axios from "axios"

import { PlusIcon } from "../assets/icons"
import { Table } from "../components"

const Inventory = () => {
  const navigate = useNavigate()
  const [inventory, setInventory] = useState([])
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("/inventory")
        setInventory(res.data)
      } catch (err) {
        console.log(err)
      }
    }

    fetchData()
  }, [])

  return (
    <div className="py-10">
      <div className="flex justify-between">
        <h1>Inventory</h1>
        <button
          className="mr-5 rounded-full bg-green-500 px-2 py-1 font-bold text-white hover:bg-green-700"
          onClick={() =>
            navigate("/add_form", {
              state: {
                toBeAddedKeys: ["name", "quantity", "restaurantID"],
                lastID:
                  inventory.length > 0
                    ? Math.max(...inventory.map((item) => item.inventoryID))
                    : 0,
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
    </div>
  )
}

export default Inventory
