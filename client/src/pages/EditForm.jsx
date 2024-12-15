import React, { useEffect, useState } from "react"

import axios from "axios"
import { useLocation, useNavigate } from "react-router-dom"

import { DropDown, Input, InputDropDown } from "../components"
import { deliverystatus, keyMapping, paymentstatus } from "../constants"

const getNameByID = (id, list, tableName) => {
  let item = {}

  if (tableName === "restaurant") {
    item = list.find((r) => r.restaurantID === id)
  } else if (tableName === "supplier") {
    item = list.find((s) => s.supplierID === id)
  } else if (tableName === "inventory") {
    item = list.find((i) => i.inventoryID === id)
  } else if (tableName === "employee") {
    item = list.find((i) => i.employeeID === id)
  } else if (tableName === "menuitem") {
    item = list.find((i) => i.menuitemID === id)
  }
  return item ? item.name : ""
}

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
  const [formData, setFormData] = useState([])
  const [restID, setRestID] = useState()
  console.log(dataToBeUpdated)
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (tableName === "menuitem") {
          const restIDRes = await axios.get(
            `/get_menuitem/${dataToBeUpdated["menuitemID"]}`
          )
          setRestID(restIDRes.data[0].restaurantID)
        } else if (tableName === "employee") {
          const restRes = await axios.get("/restaurants")
          setRestaurants(restRes.data)
          const { restaurantName, ...restData } = dataToBeUpdated
          setFormData({
            ...restData,
            restaurantID: restRes.data.find((r) => r.name === restaurantName)
              .restaurantID,
          })
        } else if (tableName === "inventory") {
          const restRes = await axios.get("/restaurants")
          setRestaurants(restRes.data)
          const suppRes = await axios.get("/suppliers")
          setSuppliers(suppRes.data)
          const { restaurantName, supplierName, ...restData } = dataToBeUpdated
          setFormData({
            ...restData,
            restaurantID: restRes.data.find((r) => r.name === restaurantName)
              .restaurantID,
            supplierID: suppRes.data.find((s) => s.name === supplierName)
              .supplierID,
          })
        } else if (tableName === "inventoryorderitem") {
          const invRes = await axios.get("/inventory")
          setInventory(invRes.data)
          const { name, ...restData } = dataToBeUpdated
          setFormData({
            ...restData,
            inventoryID: invRes.data.find((r) => r.name === name).inventoryID,
          })
        } else if (tableName === "inventoryorder") {
          const restRes = await axios.get("/restaurants")
          setRestaurants(restRes.data)
          const suppRes = await axios.get("/suppliers")
          setSuppliers(suppRes.data)
          const empRes = await axios.get("/employees")
          setEmployees(empRes.data)
          const { restaurantName, supplierName, employeeName, ...restData } =
            dataToBeUpdated
          setFormData({
            ...restData,
            restaurantID: restRes.data.find((r) => r.name === restaurantName)
              .restaurantID,
            supplierID: suppRes.data.find((s) => s.name === supplierName)
              .supplierID,
            employeeID: empRes.data.find((e) => e.name === employeeName)
              .employeeID,
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
        }
      } catch (err) {
        console.log(err)
      }
    }
    fetchData()
  }, [customerOrderID, dataToBeUpdated, tableName])

  // console.log(formData)

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
  } else if (tableName === "menuitem") {
    toBeUpdatedKeysList = Object.keys(formData).filter(
      (key) => key !== `${tableName}ID` && key !== "restaurantID"
    )
  } else if (tableName === "inventoryorderitem") {
    toBeUpdatedKeysList = Object.keys(formData).filter(
      (key) =>
        key !== `${tableName}ID` && key !== "name" && key !== "inventoryID"
    )
  } else if (tableName === "inventoryorder") {
    toBeUpdatedKeysList = []
  } else {
    toBeUpdatedKeysList = Object.keys(formData).filter(
      (key) => key !== `${tableName}ID`
    )
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    try {
      if (tableName === "menuitem") {
        await axios.post(`/edit_menuitem/${formData["menuitemID"]}`, {
          ...formData,
          restaurantID: restID,
        })
      } else if (tableName === "inventoryorderitem") {
        await axios.post(
          `/edit_inventoryorderitem/${formData["inventoryOrderID"]}`,
          {
            ...formData,
          }
        )
      } else if (tableName === "customerorderitem") {
        const updatedFormData = formData.map((item) => ({
          ...item,
          newMenuitemID: item.newMenuitemID ?? item.menuitemID,
        }))

        await axios.post(`/edit_customerorderitems/${customerOrderID}`, {
          items: updatedFormData,
        })
      } else {
        await axios.post(`/edit_${tableName}/${formData[`${tableName}ID`]}`, {
          ...formData,
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
        Edit in{" "}
        {tableName === "inventoryorder"
          ? "Inventory Order"
          : tableName === "inventoryorderitem"
            ? "Inventory Order Item"
            : tableName === "customerorder"
              ? "Customer Order"
              : tableName === "customerorderitem"
                ? "Customer Order Item"
                : tableName.charAt(0).toUpperCase() +
                  tableName.slice(1).toLowerCase()}{" "}
        Table
      </h1>
      <form onSubmit={handleSubmit}>
        {tableName !== "customerorderitem" &&
          toBeUpdatedKeysList.map((key) => (
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
                onChange={(e) => {
                  const { name, value } = e.target
                  setFormData((prevFormData) => ({
                    ...prevFormData,
                    [name]: value,
                  }))
                }}
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
        {tableName === "customerorderitem" && (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {formData.map((item, index) => (
              <div className="py-5" key={index}>
                <label
                  htmlFor="menuitem"
                  className="block text-sm font-medium text-gray-700"
                >
                  Menu Item
                </label>
                <InputDropDown
                  label="menuitem"
                  options={menuitems}
                  onChange={(newOrderItemID) => {
                    setFormData((prevFormData) =>
                      prevFormData.map((prevItem, prevIndex) =>
                        prevIndex === index
                          ? {
                              ...prevItem,
                              newMenuitemID: newOrderItemID,
                            }
                          : prevItem
                      )
                    )
                  }}
                  defaultValue={getNameByID(
                    item.menuitemID,
                    menuitems,
                    "menuitem"
                  )}
                />
                <label className="block text-sm font-medium text-gray-700">
                  Quantity
                </label>
                <Input
                  name="quantity"
                  type="number"
                  onChange={(e) => {
                    const { name, value } = e.target
                    setFormData((prevFormData) =>
                      prevFormData.map((prevItem, prevIndex) =>
                        prevIndex === index
                          ? {
                              ...prevItem,
                              [name]: parseInt(value, 10),
                            }
                          : prevItem
                      )
                    )
                  }}
                  value={item.quantity || ""}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  min={1}
                  required
                />
              </div>
            ))}
          </div>
        )}
        {(tableName === "employee" ||
          tableName === "inventory" ||
          tableName === "inventoryorder") && (
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
              defaultValue={getNameByID(
                formData.restaurantID,
                restaurants,
                "restaurant"
              )}
            />
          </div>
        )}
        {(tableName === "inventory" || tableName === "inventoryorder") && (
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
              defaultValue={getNameByID(
                formData.supplierID,
                suppliers,
                "supplier"
              )}
            />
          </div>
        )}
        {tableName === "inventoryorder" && (
          <>
            <div className="py-5">
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
                defaultValue={getNameByID(
                  formData.employeeID,
                  employees,
                  "employee"
                )}
              />
            </div>
            <div className="py-5">
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
            <div className="py-5">
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
            <div className="py-5">
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
          </>
        )}
        {tableName === "inventoryorderitem" && (
          <div className="py-5">
            <label
              htmlFor="inventoryorderitem"
              className="block text-sm font-medium text-gray-700"
            >
              Inventory Item
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
              defaultValue={getNameByID(
                formData.inventoryID,
                inventory,
                "inventory"
              )}
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
