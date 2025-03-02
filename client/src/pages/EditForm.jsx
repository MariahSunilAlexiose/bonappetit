import React, { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"

import axios from "axios"

import { DropDown, Input, InputDropDown } from "../components"
import {
  createStateSetters,
  deliverystatus,
  displayNames,
  EditFormApiMapping,
  formFormatDate,
  getNameByID,
  keyMapping,
  paymentstatus,
} from "../constants"

const EditForm = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { tableName, dataToBeUpdated } = location.state || {}
  const [restaurants, setRestaurants] = useState([])
  const [inventory, setInventory] = useState([])
  const [menuitems, setMenuitems] = useState([])
  const [suppliers, setSuppliers] = useState([])
  const [employees, setEmployees] = useState([])
  const [formData, setFormData] = useState(dataToBeUpdated)
  const [customers, setCustomers] = useState([])
  const [isFormatted, setIsFormatted] = useState(true)

  const stateSetters = createStateSetters(
    setRestaurants,
    setInventory,
    setSuppliers,
    setEmployees,
    setCustomers
  )

  useEffect(() => {
    const fetchData = async () => {
      try {
        const endpoints = EditFormApiMapping[tableName]
        if (endpoints) {
          for (const endpoint of endpoints) {
            const response = await axios.get(endpoint)
            stateSetters[endpoint](response.data)
          }
        }
        if (tableName === "customerorderitem") {
          const res = await axios.get(
            `/get_menu_by_id/${formData.restaurantID}`
          )
          setMenuitems(res.data)
        }
      } catch (err) {
        console.log(err)
      }
    }
    fetchData()
  }, [dataToBeUpdated, tableName, formData.restaurantID, stateSetters])

  const handleSubmit = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    try {
      if (tableName === "customerorderitem") {
        if (!formData.newMenuitemID) {
          await axios.post(
            `/edit_customerorderitem/${dataToBeUpdated.customerorderID}`,
            {
              ...formData,
              newMenuitemID: dataToBeUpdated.menuitemID,
            }
          )
        } else {
          await axios.post(
            `/edit_customerorderitem/${dataToBeUpdated.customerorderID}`,
            {
              ...formData,
            }
          )
        }
      } else if (tableName === "employeeorder") {
        await axios.post(`/edit_customerorder/${formData.customerorderID}`, {
          ...formData,
        })
      } else if (tableName === "inventoryorderitem") {
        await axios.post(`/edit_inventoryorder/${formData.inventoryorderID}`, {
          ...formData,
        })
      } else {
        await axios.post(`/edit_${tableName}/${formData[`${tableName}ID`]}`, {
          ...formData,
        })
      }
      navigate(-1)
    } catch (err) {
      console.error("Error in editing:", err)
    }
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
        {Object.keys(formData)
          .filter((key) => {
            if (
              (tableName === "employeeorder" && key === "customerorderID") ||
              (tableName === "inventoryorderitem" &&
                key === "inventoryorderID") ||
              (tableName === "customerorderitem" &&
                (key === "customerorderID" || key === "restaurantID")) ||
              key === "newMenuitemID"
            ) {
              return false
            }
            return key !== `${tableName}ID` && !key.endsWith("Name")
          })
          .map((key) => (
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
                    htmlFor="date"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Date
                  </label>
                  <Input
                    type="date"
                    id="date"
                    name="date"
                    value={
                      isFormatted
                        ? formFormatDate(formData.date)
                        : formData.date
                    }
                    onChange={(e) => {
                      setFormData((prevFormData) => ({
                        ...prevFormData,
                        date: e.target.value,
                      }))
                      setIsFormatted(false)
                    }}
                  />
                </div>
              ) : key === "restaurantID" ? (
                <div>
                  <label
                    htmlFor="restaurants"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Restaurant
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
                    defaultValue={getNameByID(
                      formData.employeeID,
                      employees,
                      "employee"
                    )}
                  />
                </div>
              ) : key === "customerID" ? (
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
                    defaultValue={getNameByID(
                      formData.customerID,
                      customers,
                      "customer"
                    )}
                  />
                </div>
              ) : key === "supplierID" ? (
                <div>
                  <label
                    htmlFor="suppliers"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Supplier
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
              ) : key === "inventoryID" ? (
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
                    defaultValue={getNameByID(
                      formData.inventoryID,
                      inventory,
                      "inventory"
                    )}
                  />
                </div>
              ) : key === "menuitemID" ? (
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
                    onChange={(newOrderItemID) => {
                      setFormData((prevFormData) => ({
                        ...prevFormData,
                        newMenuitemID:
                          newOrderItemID || prevFormData.menuitemID,
                      }))
                    }}
                    defaultValue={getNameByID(
                      formData.menuitemID,
                      menuitems,
                      "menuitem"
                    )}
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
                    onChange={(e) => {
                      setFormData((prevFormData) => ({
                        ...prevFormData,
                        quantity: e.target.value,
                      }))
                    }}
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
                    onChange={(e) => {
                      const { name, value } = e.target
                      setFormData((prevFormData) => ({
                        ...prevFormData,
                        [name]: value,
                      }))
                    }}
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
