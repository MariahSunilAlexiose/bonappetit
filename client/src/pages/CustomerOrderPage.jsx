import React, { useEffect, useState } from "react"

import axios from "axios"
import { useNavigate, useParams } from "react-router-dom"

import { PlusIcon } from "../assets/icons"
import { Table } from "../components"

const CustomerOrderPage = () => {
  const navigate = useNavigate()
  const { customerOrderID } = useParams()
  const [customerOrderItems, setCustomerOrderItems] = useState([])
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          `/get_customerorderitems/${customerOrderID}`
        )
        setCustomerOrderItems(res.data)
      } catch (err) {
        console.log(err)
      }
    }
    fetchData()
  }, [customerOrderID])
  return (
    <div className="py-10">
      <div className="flex justify-between">
        <h1>Customer Order Details</h1>
        <div className="flex font-medium gap-2 align-middle">
          <button
            onClick={(e) => {
              e.stopPropagation()
              navigate("/edit_form", {
                state: {
                  dataToBeUpdated: customerOrderItems,
                  tableName: "customerorderitem",
                  customerOrderID: customerOrderID,
                },
              })
            }}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded"
          >
            Edit
          </button>
          <button
            className="mr-1 bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded-full"
            onClick={() => {
              navigate("/add_form", {
                state: {
                  toBeAddedKeys: Object.keys(customerOrderItems[0]).filter(
                    (key) => key !== "name"
                  ),
                  tableName: "customerorderitem",
                  id: customerOrderID,
                },
              })
            }}
          >
            <img alt="Plus Icon" src={PlusIcon} width={20} height={20} />
          </button>
        </div>
      </div>
      <Table data={customerOrderItems} tableName="customerorderitem" />
    </div>
  )
}

export default CustomerOrderPage
