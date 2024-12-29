import React, { useState } from "react"

import axios from "axios"
import { useLocation, useNavigate } from "react-router-dom"

import {
  Input
} from "../components"
import { keyMapping } from "../constants"

const AddForm = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { toBeAddedKeys, lastID, tableName, fromId } = location.state || {}
  const [formData, setFormData] = useState({} | [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
      // inventoryOrderID: parseInt(id)
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (tableName === "menuitem") {
        await axios.post(`/add_menuitem`, {
          ...formData,
          menuitemID: lastID + 1,
          restaurantID: fromId
        })
      } else {
        await axios.post(`/add_${tableName}`, {
          ...formData,
          [`${tableName}ID`]: lastID + 1
        })
      }
      navigate(-1)
    } catch (err) {
      console.error("Error in adding:", err)
    }
  }

  return (
    <div className="pt-10">
      <h1>
        Add to{" "}
        {tableName === "menuitem" ? "Menu Item" : tableName.charAt(0).toUpperCase() + tableName.slice(1).toLowerCase()}
      </h1>
      <form onSubmit={handleSubmit}>
        {toBeAddedKeys &&
          toBeAddedKeys.map((key) => (
            <div key={key} className="py-5">
              <label
                htmlFor={key}
                className="block text-sm font-medium text-gray-700"
              >
                {keyMapping[key] || key}
              </label>
              <Input
                name={key}
                type={
                  key === "rating" ||
                  key === "salary" ||
                  key === "unitPrice" ||
                  key === "price" ||
                  key === "quantity"
                    ? "number"
                    : key === "phone"
                      ? "tel"
                      : key === "email"
                        ? "email"
                        : "text"
                }
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                step={
                  key === "rating"
                    ? "0.1"
                    : key === "salary" || key === "unitPrice"
                      ? "0.01"
                      : undefined
                }
                min={
                  key === "rating" || key === "unitPrice"
                    ? "0"
                    : key === "salary"
                      ? "17.30"
                      : key === "quantity"
                        ? "1"
                        : undefined
                }
                max={key === "rating" ? "5" : undefined}
                required
              />
            </div>
          ))}
        <div className="flex justify-end">
          <button
            type="submit"
            className="mt-4 p-2 bg-blue-500 text-white rounded"
          >
            Add
          </button>
        </div>
      </form>
    </div>
  )
}

export default AddForm
