import React, { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"

import axios from "axios"

import { DropDown, Input, InputDropDown } from "../components"
import {
  deliverystatus,
  displayNames,
  keyMapping,
  paymentstatus,
} from "../constants"

function formatDate(isoString) {
  if (!isoString) return "" // Handle cases where isoString is undefined or null
  const date = new Date(isoString)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  const hours = String(date.getHours()).padStart(2, "0")
  const minutes = String(date.getMinutes()).padStart(2, "0")
  return `${year}-${month}-${day}T${hours}:${minutes}`
}

const EditForm = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { tableName, dataToBeUpdated, customerOrderID } = location.state || {}
  const [restaurants, setRestaurants] = useState([])
  const [inventory, setInventory] = useState([])
  const [menuitems, setMenuitems] = useState([])
  const [suppliers, setSuppliers] = useState([])
  const [employees, setEmployees] = useState([])
  const [formData, setFormData] = useState(dataToBeUpdated)
  const [customers, setCustomers] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (
          tableName === "employee" ||
          tableName === "customerorder" ||
          tableName === "inventory"
        ) {
          const restRes = await axios.get("/restaurants")
          setRestaurants(restRes.data)
          const { restaurantName, ...restData } = dataToBeUpdated
          setFormData({
            ...restData,
            restaurantID: restRes.data.find((r) => r.name === restaurantName)
              .restaurantID,
          })
        } else if (tableName === "customerorderitem") {
          const order = await axios.get(`/customerorder/${customerOrderID}`)
          const res = await axios.get(
            `/get_menu/${order.data[0].restaurantName}`
          )
          setMenuitems(res.data)
          const updatedData = dataToBeUpdated.map((item) => {
            const { menuItemName, ...restData } = item
            const matchingMenuItem = res.data.find(
              (r) => r.name === menuItemName
            )
            return {
              ...restData,
              menuitemID: matchingMenuItem
                ? matchingMenuItem.menuitemID
                : undefined,
            }
          })
          setFormData(updatedData)
        } else if (tableName === "inventoryorder") {
          const empRes = await axios.get("/employees")
          setEmployees(empRes.data)
          const invRes = await axios.get("/inventory")
          setInventory(invRes.data)
          const restRes = await axios.get("/restaurants")
          setRestaurants(restRes.data)
          const { restaurantName, employeeName, ...restData } = dataToBeUpdated
          setFormData({
            ...restData,
            employeeID: empRes.data.find((e) => e.name === employeeName)
              .employeeID,
            restaurantID: restRes.data.find((r) => r.name === restaurantName)
              .restaurantID,
          })
        } else if (tableName === "employeeorder") {
          const cusRes = await axios.get("/customers")
          setCustomers(cusRes.data)
        } else if (tableName === "supplierorder") {
          const supRes = await axios.get("/suppliers")
          setSuppliers(supRes.data)
          const restRes = await axios.get("/restaurants")
          setRestaurants(restRes.data)
          const { restaurantName, ...restData } = dataToBeUpdated
          setFormData({
            ...restData,
            restaurantID: restRes.data.find((r) => r.name === restaurantName)
              .restaurantID,
          })
        }
      } catch (err) {
        console.log(err)
      }
    }
    fetchData()
  }, [customerOrderID, dataToBeUpdated, tableName])

  let toBeUpdatedKeysList = []

  toBeUpdatedKeysList = Object.keys(formData).filter(
    (key) => key !== `${tableName}ID`
  )

  const handleSubmit = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    try {
      await axios.post(`/edit_${tableName}/${formData[`${tableName}ID`]}`, {
        ...formData,
      })
      navigate(-1)
    } catch (err) {
      console.error("Error in editting:", err)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }))
  }

  console.log(formData)

  return (
    <div className="pt-10">
      <h1>
        Edit in{" "}
        {displayNames[tableName] ||
          tableName.charAt(0).toUpperCase() +
            tableName.slice(1).toLowerCase()}{" "}
        Table
      </h1>
      <form onSubmit={handleSubmit}>
        {tableName !== "customerorderitem" &&
          toBeUpdatedKeysList.map((key) => (
            <div key={key} className="py-5">
              {key === "paymentStatus" ? (
                <div>
                  <label
                    htmlFor="payment"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Payment Status
                  </label>
                  <DropDown
                    options={paymentstatus}
                    onChange={(status) => {
                      setFormData((prevFormData) => ({
                        ...prevFormData,
                        paymentStatus: status,
                      }))
                    }}
                    defaultValue={formData.paymentStatus}
                  />
                </div>
              ) : key === "deliveryStatus" ? (
                <div>
                  <label
                    htmlFor="delivery"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Delivery Status
                  </label>
                  <DropDown
                    options={deliverystatus}
                    onChange={(status) => {
                      setFormData((prevFormData) => ({
                        ...prevFormData,
                        deliveryStatus: status,
                      }))
                    }}
                    defaultValue={formData.deliveryStatus}
                  />
                </div>
              ) : key === "date" ? (
                <div>
                  <label
                    htmlFor="payment"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Date
                  </label>
                  <Input
                    type="datetime"
                    id="date"
                    name="date"
                    value={formatDate(formData.date)}
                    onChange={(e) => {
                      setFormData((prevFormData) => ({
                        ...prevFormData,
                        date: e.target.value,
                      }))
                    }}
                  />
                </div>
              ) : key === "restaurantName" ? (
                <div>
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
                    defaultValue={formData.restaurantName}
                  />
                </div>
              ) : key === "employeeName" ? (
                <div>
                  <label
                    htmlFor="employee"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Employee
                  </label>
                  <InputDropDown
                    label="employees"
                    options={employees}
                    onChange={(newEmployeeID) => {
                      setFormData((prevFormData) => ({
                        ...prevFormData,
                        employeeID: newEmployeeID,
                      }))
                    }}
                  />
                </div>
              ) : key === "customerID" || key === "customerName" ? (
                <div>
                  <label
                    htmlFor="customer"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Customer
                  </label>
                  <InputDropDown
                    label="customers"
                    options={customers}
                    onChange={(newCustomerID) => {
                      setFormData((prevFormData) => ({
                        ...prevFormData,
                        customerID: newCustomerID,
                      }))
                    }}
                    defaultValue={formData.customerName}
                  />
                </div>
              ) : key === "employeeID" ? (
                <div>
                  <label
                    htmlFor="employee"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Employee
                  </label>
                  <InputDropDown
                    label="employees"
                    options={employees}
                    onChange={(newEmployeeID) => {
                      setFormData((prevFormData) => ({
                        ...prevFormData,
                        employeeID: newEmployeeID,
                      }))
                    }}
                    defaultValue={formData.employeeName}
                  />
                </div>
              ) : key === "supplierID" || key === "supplierName" ? (
                <div>
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
                    defaultValue={formData.supplierName}
                  />
                </div>
              ) : key === "inventoryID" || key === "inventoryName" ? (
                <div>
                  <label
                    htmlFor="inventoryorderitem"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Inventory
                  </label>
                  <InputDropDown
                    label="inventory"
                    options={inventory}
                    onChange={(newOrderItemID) => {
                      setFormData((prevFormData) => ({
                        ...prevFormData,
                        inventoryID: newOrderItemID,
                      }))
                    }}
                    defaultValue={formData.inventoryName}
                  />
                </div>
              ) : key === "menuitemName" ? (
                <div>
                  <label
                    htmlFor="menuitem"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Menu Item
                  </label>
                  <InputDropDown
                    label="menuitem"
                    options={menuitems}
                    onChange={(newMenuItemID) => {
                      setFormData((prevFormData) => ({
                        ...prevFormData,
                        menuitemID: newMenuItemID,
                      }))
                    }}
                    defaultValue={formData.menuitemName}
                  />
                </div>
              ) : key === "quantity" ? (
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Quantity
                  </label>
                  <Input
                    name="quantity"
                    type="number"
                    value={formData.quantity || ""}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    min={1}
                    required
                  />
                </div>
              ) : (
                <div>
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
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    step={
                      key === "rating"
                        ? "0.1"
                        : key === "salary" ||
                            key === "unitPrice" ||
                            key === "price"
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
                    value={formData[key] || ""}
                    onChange={handleChange}
                    required
                  />
                </div>
              )}
            </div>
          ))}
        <div className="flex justify-end">
          <button
            type="submit"
            className="mr-5 mt-4 rounded bg-blue-500 p-2 text-white"
          >
            Update
          </button>
        </div>
      </form>
    </div>
  )
}

export default EditForm
