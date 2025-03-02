import React, { useCallback, useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"

import axios from "axios"

import { DropDown, Input, InputDropDown } from "../components"
import {
  AddFormApiMapping,
  createStateSetters,
  deliverystatus,
  displayNames,
  getNameByID,
  keyMapping,
  paymentstatus,
} from "../constants"

const AddForm = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [currentDate, setCurrentDate] = useState(
    new Date().toISOString().slice(0, 10)
  )
  const { toBeAddedKeys, lastID, tableName, id } = location.state || {}
  const [formData, setFormData] = useState({} | [])
  const [restaurants, setRestaurants] = useState([])
  const [restaurant, setRestaurant] = useState(null)
  const [inventory, setInventory] = useState([])
  const [suppliers, setSuppliers] = useState([])
  const [employees, setEmployees] = useState([])
  const [customers, setCustomers] = useState([])
  const [menuitems, setMenuitems] = useState([])

  const stateSetters = createStateSetters(
    setRestaurants,
    setInventory,
    setSuppliers,
    setEmployees,
    setCustomers
  )

  const handleRestaurantChange = async (newRestaurantID) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      restaurantID: newRestaurantID,
    }))
    setRestaurant(newRestaurantID)
    try {
      const resName = await axios.get(
        `/get_restaurant_by_id/${newRestaurantID}`
      )
      const res = await axios.get(`/get_menu/${resName.data[0].name}`)
      setMenuitems(res.data)
    } catch (err) {
      console.log(err)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (tableName === "menuitem") {
        await axios.post("/add_menuitem", {
          ...formData,
          menuitemID: lastID + 1,
          restaurantID: id,
        })
      } else if (tableName === "inventoryorder") {
        await axios.post("/add_inventoryorder", {
          ...formData,
          date: currentDate,
          inventoryID: id,
          inventoryorderID: lastID + 1,
        })
      } else if (tableName === "supplierorder") {
        await axios.post("/add_supplierorder", {
          ...formData,
          date: currentDate,
          supplierID: id,
          inventoryorderID: lastID + 1,
        })
      } else {
        await axios.post(`/add_${tableName}`, {
          ...formData,
          [`${tableName}ID`]: lastID + 1,
        })
      }
      navigate(-1)
    } catch (err) {
      console.error("Error in adding:", err)
    }
  }

  const fetchData = useCallback(async () => {
    try {
      const endpoints = AddFormApiMapping[tableName]
      if (endpoints) {
        for (const endpoint of endpoints) {
          const response = await axios.get(endpoint)
          stateSetters[endpoint](response.data)
        }

        if (tableName === "customerorder") {
          setFormData((prevFormData) => ({
            ...prevFormData,
            date: currentDate,
            customerID: id,
            items: [{ menuitemID: 0, quantity: 1 }],
          }))
        } else if (tableName === "customerorderitem") {
          const itemsRes = await axios.get(`/get_menu_by_id/${id}`)
          const resItems = await axios.get(`/get_customerorderitems/${id}`)
          setMenuitems(
            itemsRes.data.filter(
              (menuItem) =>
                !resItems.data.some(
                  (customerOrderItem) =>
                    customerOrderItem.menuitemName === menuItem.name
                )
            )
          )
          setFormData((prevFormData) => ({
            ...prevFormData,
            customerorderID: id,
          }))
        } else if (tableName === "employeeorder") {
          setFormData((prevFormData) => ({
            ...prevFormData,
            date: currentDate,
            employeeID: id,
            customerorderID: lastID + 1,
            items: [{ menuitemID: 0, quantity: 1 }],
          }))
        } else if (tableName === "supplierorder") {
          setFormData((prevFormData) => ({
            ...prevFormData,
            items: [{ inventoryID: 0, quantity: 1, unitPrice: 0 }],
          }))
        } else if (tableName === "supplierorderitem") {
          const itemsRes = await axios.get(`/inventory`)
          const resItems = await axios.get(`/get_inventoryorderitems/${id}`)
          setMenuitems(
            itemsRes.data.filter(
              (menuItem) =>
                !resItems.data.some(
                  (customerOrderItem) =>
                    customerOrderItem.menuitemName === menuItem.name
                )
            )
          )
          setFormData((prevFormData) => ({
            ...prevFormData,
            inventoryorderID: id,
          }))
        }
      }
    } catch (err) {
      console.log(err)
    }
  }, [tableName, id, currentDate, lastID, stateSetters])

  useEffect(() => {
    fetchData()
  }, [tableName, fetchData])

  return (
    <div className="pt-10">
      <h1>
        Add to{" "}
        {displayNames[tableName] ||
          tableName.charAt(0).toUpperCase() + tableName.slice(1).toLowerCase()}
      </h1>
      <form onSubmit={handleSubmit}>
        {toBeAddedKeys &&
          toBeAddedKeys
            .filter((key) => {
              if (
                (tableName === "customerorderitem" && key === "restaurantID") ||
                (tableName === "supplierorderitem" &&
                  key === "inventoryorderID")
              ) {
                return false
              }
              return key !== `${tableName}ID`
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
                      defaultValue={paymentstatus[0]}
                      onChange={(status) => {
                        setFormData((prevFormData) => ({
                          ...prevFormData,
                          paymentStatus: status,
                        }))
                      }}
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
                      defaultValue={deliverystatus[0]}
                      onChange={(status) => {
                        setFormData((prevFormData) => ({
                          ...prevFormData,
                          deliveryStatus: status,
                        }))
                      }}
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
                      type="date"
                      id="date"
                      name="date"
                      value={currentDate}
                      onChange={(e) => {
                        setFormData((prevFormData) => ({
                          ...prevFormData,
                          date: e.target.value,
                        }))
                        setCurrentDate(e.target.value)
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
                      onChange={handleRestaurantChange}
                    />
                    {restaurant &&
                      (tableName === "customerorder" ||
                        tableName === "employeeorder") && (
                        <div className="py-3">
                          {formData.items.map((item, index) => (
                            <div key={index} className="py-3">
                              <label
                                htmlFor={`menuitem-${index}`}
                                className="block text-sm font-medium text-gray-700"
                              >
                                Menu Item
                              </label>
                              <InputDropDown
                                label="menuitem"
                                options={menuitems}
                                onChange={(newOrderItemID) => {
                                  setFormData((prevFormData) => {
                                    const updatedItems = prevFormData.items.map(
                                      (i, idx) =>
                                        idx === index
                                          ? { ...i, menuitemID: newOrderItemID }
                                          : i
                                    )
                                    return {
                                      ...prevFormData,
                                      items: updatedItems,
                                    }
                                  })
                                }}
                              />
                              <label className="block text-sm font-medium text-gray-700">
                                Quantity
                              </label>
                              <Input
                                name={`quantity-${index}`}
                                type="number"
                                value={item.quantity}
                                onChange={(e) => {
                                  const value = parseInt(e.target.value, 10)
                                  setFormData((prevFormData) => {
                                    const updatedItems = prevFormData.items.map(
                                      (i, idx) =>
                                        idx === index
                                          ? { ...i, quantity: value }
                                          : i
                                    )
                                    return {
                                      ...prevFormData,
                                      items: updatedItems,
                                    }
                                  })
                                }}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                min={1}
                                required
                              />
                            </div>
                          ))}
                          <button
                            type="button"
                            className="mt-3 inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                            onClick={() => {
                              setFormData((prevFormData) => ({
                                ...prevFormData,
                                items: [
                                  ...prevFormData.items,
                                  { menuitemID: 0, quantity: 1 },
                                ],
                              }))
                            }}
                          >
                            Add Menu Item
                          </button>
                        </div>
                      )}
                    {restaurant && tableName === "supplierorder" && (
                      <div className="py-3">
                        {formData.items.map((item, index) => (
                          <div key={index} className="py-3">
                            <label
                              htmlFor={`inventoryitem-${index}`}
                              className="block text-sm font-medium text-gray-700"
                            >
                              Inventory Item
                            </label>
                            <InputDropDown
                              label="inventory"
                              options={inventory}
                              onChange={(newItemID) => {
                                setFormData((prevFormData) => {
                                  const updatedItems = prevFormData.items.map(
                                    (i, idx) =>
                                      idx === index
                                        ? { ...i, inventoryID: newItemID }
                                        : i
                                  )
                                  return {
                                    ...prevFormData,
                                    items: updatedItems,
                                  }
                                })
                              }}
                            />
                            <label className="block text-sm font-medium text-gray-700">
                              Quantity
                            </label>
                            <Input
                              name={`quantity-${index}`}
                              type="number"
                              value={item.quantity}
                              onChange={(e) => {
                                const value = parseInt(e.target.value, 10)
                                setFormData((prevFormData) => {
                                  const updatedItems = prevFormData.items.map(
                                    (i, idx) =>
                                      idx === index
                                        ? { ...i, quantity: value }
                                        : i
                                  )
                                  return {
                                    ...prevFormData,
                                    items: updatedItems,
                                  }
                                })
                              }}
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                              min={1}
                              required
                            />
                            <label className="block text-sm font-medium text-gray-700">
                              Unit Price
                            </label>
                            <Input
                              name={`unitPrice-${index}`}
                              type="number"
                              value={item.unitPrice}
                              onChange={(e) => {
                                setFormData((prevFormData) => {
                                  const updatedItems = prevFormData.items.map(
                                    (i, idx) =>
                                      idx === index
                                        ? {
                                            ...i,
                                            unitPrice: parseFloat(
                                              e.target.value
                                            ),
                                          }
                                        : i
                                  )
                                  return {
                                    ...prevFormData,
                                    items: updatedItems,
                                  }
                                })
                              }}
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                              step="0.01"
                              min="0"
                              required
                            />
                          </div>
                        ))}
                        <button
                          type="button"
                          className="mt-3 inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                          onClick={() => {
                            setFormData((prevFormData) => ({
                              ...prevFormData,
                              items: [
                                ...prevFormData.items,
                                { menuitemID: 0, quantity: 1 },
                              ],
                            }))
                          }}
                        >
                          Add Inventory Item
                        </button>
                      </div>
                    )}
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
                      onChange={(newMenuItemID) => {
                        setFormData((prevFormData) => ({
                          ...prevFormData,
                          menuitemID: newMenuItemID,
                        }))
                      }}
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
                      defaultValue={
                        tableName === "employeeorder"
                          ? getNameByID(id, employees, "employee")
                          : ""
                      }
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
                      defaultValue={
                        tableName === "supplierorder" &&
                        getNameByID(id, suppliers, "supplier")
                      }
                    />
                  </div>
                ) : key === "inventoryID" ? (
                  <div>
                    <label
                      htmlFor="inventory"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Inventory
                    </label>
                    <InputDropDown
                      label="inventory"
                      options={inventory}
                      onChange={(newInventoryID) => {
                        setFormData((prevFormData) => ({
                          ...prevFormData,
                          inventoryID: newInventoryID,
                        }))
                      }}
                      defaultValue={getNameByID(id, inventory, "inventory")}
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
                      onChange={(e) => {
                        const { name, value } = e.target
                        let parsedValue
                        if (
                          name === "rating" ||
                          name === "salary" ||
                          name === "unitPrice" ||
                          name === "price"
                        ) {
                          parsedValue = parseFloat(value)
                        } else if (name === "quantity") {
                          parsedValue = parseInt(value, 10)
                        } else {
                          parsedValue = value
                        }
                        setFormData((prevFormData) => ({
                          ...prevFormData,
                          [name]: parsedValue,
                        }))
                      }}
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
                      required
                    />
                  </div>
                )}
              </div>
            ))}
        <div className="flex justify-end">
          <button
            type="submit"
            className="mr-5 rounded bg-blue-500 p-2 text-white"
          >
            Add
          </button>
        </div>
      </form>
    </div>
  )
}

export default AddForm
