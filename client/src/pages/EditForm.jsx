import React, { useEffect, useState } from "react"

import axios from "axios"
import { useLocation, useNavigate } from "react-router-dom"

import { Input, InputDropDown } from "../components"

const keyMapping = {
  restaurantID: "Restaurant ID",
  name: "Name",
  address: "Address",
  phone: "Phone",
  rating: "Rating",
  customerID: "Customer ID",
  email: "Email",
  employeeID: "Employee ID",
  role: "Role",
  salary: "Salary",
  inventoryID: "Inventory ID",
  quantity: "Quantity",
  unitPrice: "Unit Price",
  supplierID: "Supplier ID",
  contactperson: "Contact Person",
  restaurantName: "Restaurant",
  supplierName: "Supplier",
}

const replaceNamesWithRestIDs = (data, restaurantsList) => {
  const { restaurantName, ...restData } = data
  const restaurant = restaurantsList.find((r) => r.name === restaurantName)
  return {
    ...restData,
    restaurantID: restaurant ? restaurant.restaurantID : data.restaurantID,
  }
}

const replaceNamesWithBothIDs = (data, restaurantsList, suppliersList) => {
  const { supplierName, restaurantName, ...restData } = data
  const restaurant = restaurantsList.find((r) => r.name === restaurantName)
  const supplier = suppliersList.find((s) => s.name === supplierName)
  return {
    ...restData,
    restaurantID: restaurant ? restaurant.restaurantID : data.restaurantID,
    supplierID: supplier ? supplier.supplierID : data.supplierID,
  }
}

const getRestaurantNameByID = (id, restaurantsList) => {
  const restaurant = restaurantsList.find((r) => r.restaurantID === id)
  return restaurant ? restaurant.name : ""
}

const getSupplierNameByID = (id, suppliersList) => {
  const supplier = suppliersList.find((s) => s.supplierID === id)
  return supplier ? supplier.name : ""
}

const EditForm = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { tableName, dataToBeUpdated } = location.state || {}
  const [restaurants, setRestaurants] = useState([])
  const [suppliers, setSuppliers] = useState([])
  const [formData, setFormData] = useState(dataToBeUpdated || {})

  useEffect(() => {
    const fetchData = async () => {
      try {
        const restRes = await axios.get("/restaurants")
        const suppRes = await axios.get("/suppliers")
        setRestaurants(restRes.data)
        setSuppliers(suppRes.data)

        if (dataToBeUpdated && tableName === "inventory") {
          const updatedData = replaceNamesWithBothIDs(
            dataToBeUpdated,
            restRes.data,
            suppRes.data
          )
          setFormData(updatedData)
        } else if (dataToBeUpdated && tableName === "employee") {
          const updatedData = replaceNamesWithRestIDs(
            dataToBeUpdated,
            restRes.data
          )
          setFormData(updatedData)
        }
      } catch (err) {
        console.log(err)
      }
    }

    fetchData()
  }, [dataToBeUpdated, tableName])

  let toBeUpdatedKeysList = []

  if (tableName === "employee") {
    toBeUpdatedKeysList = Object.keys(formData).filter(
      (key) => key !== `${tableName}ID` && key !== "restaurantID"
    )
  } else if (tableName === "inventory") {
    toBeUpdatedKeysList = Object.keys(formData).filter(
      (key) =>
        key !== `${tableName}ID` &&
        key !== "restaurantID" &&
        key !== "supplierID"
    )
  } else {
    toBeUpdatedKeysList = Object.keys(formData).filter(
      (key) => key !== `${tableName}ID`
    )
  }

  console.log(formData)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await axios.post(`/edit_${tableName}/${formData[`${tableName}ID`]}`, {
        ...formData,
      })
      navigate(-1)
    } catch (err) {
      console.error("Error in adding:", err)
    }
  }

  return (
    <div className="pt-10">
      <h1>
        Edit in{" "}
        {tableName.charAt(0).toUpperCase() + tableName.slice(1).toLowerCase()}
      </h1>
      <form onSubmit={handleSubmit}>
        {toBeUpdatedKeysList.map((key) => (
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
                key === "quantity"
                  ? "number"
                  : key === "phone"
                    ? "tel"
                    : key === "email"
                      ? "email"
                      : "text"
              }
              onChange={handleChange}
              value={formData[key] || ""}
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
        {(tableName === "employee" || tableName === "inventory") && (
          <div className="py-5">
            <label
              htmlFor="restaurants"
              className="block text-sm font-medium text-gray-700"
            >
              Restaurants
            </label>
            <InputDropDown
              label="restaurants"
              options={restaurants}
              onChange={(newRestaurantID) => {
                setFormData((prevFormData) => ({
                  ...prevFormData,
                  restaurantID: newRestaurantID,
                }))
              }}
              defaultValue={getRestaurantNameByID(
                formData.restaurantID,
                restaurants
              )}
            />
          </div>
        )}
        {tableName === "inventory" && (
          <div className="py-5">
            <label
              htmlFor="suppliers"
              className="block text-sm font-medium text-gray-700"
            >
              Suppliers
            </label>
            <InputDropDown
              label="suppliers"
              options={suppliers}
              onChange={(newSupplierID) => {
                setFormData((prevFormData) => ({
                  ...prevFormData,
                  supplierID: newSupplierID,
                }))
              }}
              defaultValue={getSupplierNameByID(formData.supplierID, suppliers)}
            />
          </div>
        )}
        <div className="flex justify-end">
          <button
            type="submit"
            className="mt-4 p-2 bg-blue-500 text-white rounded"
          >
            Update
          </button>
        </div>
      </form>
    </div>
  )
}

export default EditForm
