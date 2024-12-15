import React, { useEffect, useState } from "react"

import axios from "axios"
import { useNavigate, useParams } from "react-router-dom"

import { PlusIcon } from "../assets/icons"
import { Table } from "../components"

const InventoryOrderPage = () => {
  const navigate = useNavigate()
  const { inventoryOrderID } = useParams()
  const [inventoryOrderItem, setInventoryOrderItem] = useState([])
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          `/get_inventoryorderitem/${inventoryOrderID}`
        )
        setInventoryOrderItem(res.data)
      } catch (err) {
        console.log(err)
      }
    }

    fetchData()
  }, [inventoryOrderID])
  return (
    <div className="py-10">
      <div className="flex justify-between">
        <h1>Inventory Order Details</h1>
        <button
          className="mr-1 bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded-full"
          onClick={() => {
            navigate("/add_form", {
              state: {
                toBeAddedKeys: Object.keys(inventoryOrderItem[0]).filter(
                  (key) => key !== "name"
                ),
                tableName: "inventoryorderitem",
                id: inventoryOrderID,
              },
            })
          }}
        >
          <img alt="Plus Icon" src={PlusIcon} width={20} height={20} />
        </button>
      </div>
      <Table data={inventoryOrderItem} tableName="inventoryorderitem" />
    </div>
  )
}

export default InventoryOrderPage
