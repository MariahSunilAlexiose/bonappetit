import React, { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"

import axios from "axios"

import {
  DropDown,
  Input,
  InputDropDown,
  MultiSelectDropDown,
} from "../components"
import { deliverystatus, keyMapping, paymentstatus } from "../constants"

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
  const [menuitems, setMenuitems] = useState([])

  const handleRestaurantChange = async (newRestaurantID) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      restaurantID: newRestaurantID,
    }))
    setRestaurant(newRestaurantID)
    try {
      const resName = await axios.get(`/get_restaurant_name/${newRestaurantID}`)
      const res = await axios.get(`/get_menu/${resName.data[0].name}`)
      setMenuitems(res.data)
    } catch (err) {
      console.log(err)
    }
  }

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
        await axios.post("/add_menuitem", {
          ...formData,
          menuitemID: lastID + 1,
          restaurantID: id,
        })
      } else if (tableName === "inventoryorder") {
        await axios.post("/add_inventoryorder", {
          ...formData,
          inventoryID: id,
          inventoryOrderID: lastID + 1,
        })
      }
      // else if (tableName === "inventoryorderitem") {
      //   await axios.post('/add_inventoryorderitem', {
      //     ...formData,
      //     inventoryOrderID: parseInt(id)
      //   })
      // }
      else {
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

  const fetchData = async () => {
    try {
      if (tableName === "employee") {
        const restRes = await axios.get("/restaurants")
        setRestaurants(restRes.data)
      } else if (tableName === "inventory") {
        const restRes = await axios.get("/restaurants")
        const suppRes = await axios.get("/suppliers")
        setRestaurants(restRes.data)
        setSuppliers(suppRes.data)
      } else if (tableName === "inventoryorder") {
        const restRes = await axios.get("/restaurants")
        const suppRes = await axios.get("/suppliers")
        const empRes = await axios.get("/employees")
        const invRes = await axios.get("/inventory")
        console.log(invRes.data)
        setRestaurants(restRes.data)
        setSuppliers(suppRes.data)
        setEmployees(empRes.data)
        setInventory(invRes.data)

        setFormData((prevFormData) => ({
          ...prevFormData,
          date: currentDate,
        }))
      } else if (tableName === "customerorder") {
        const restRes = await axios.get("/restaurants")
        setRestaurants(restRes.data)
        setFormData((prevFormData) => ({
          ...prevFormData,
          customerID: id,
          date: currentDate,
          [`${tableName}ID`]: lastID + 1,
          items: [{ menuitemID: 0, quantity: 1 }],
        }))
      }
      // else if (tableName === "inventoryorderitem" || tableName === "inventoryorder") {
      //   const invRes = await axios.get("/inventory");
      //   setInventory(invRes.data);
      // }
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    fetchData()
  }, [tableName])

  console.log(formData)

  return (
    <div className="pt-10">
      <h1>
        Add to{" "}
        {tableName === "inventoryorder"
          ? "Inventory Order"
          : tableName === "inventoryorderitem"
            ? "Inventory Order Item"
            : tableName === "customerorder"
              ? "Customer Order"
              : tableName.charAt(0).toUpperCase() +
                tableName.slice(1).toLowerCase()}
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
                    : key === "salary" || key === "unitPrice" || key === "price"
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
        {(tableName === "inventoryorderitem" ||
          tableName === "inventoryorder") && (
          <div className="py-5">
            <label
              htmlFor="inventory"
              className="block text-sm font-medium text-gray-700"
            >
              Inventory Item
            </label>
            <MultiSelectDropDown
              options={inventory}
              onChange={(newOrderItemIDs) => {
                setFormData((prevFormData) => ({
                  ...prevFormData,
                  inventoryID: newOrderItemIDs,
                }))
              }}
            />
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
            />
          </div>
        )}
        {tableName === "customerorder" && (
          <div className="py-5">
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
            {restaurant && (
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
                          return { ...prevFormData, items: updatedItems }
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
                              idx === index ? { ...i, quantity: value } : i
                          )
                          return { ...prevFormData, items: updatedItems }
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
          </div>
        )}

        {(tableName === "inventory" || tableName === "inventoryorder") && (
          <div className="py-5">
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
            />
          </div>
        )}
        {tableName === "inventoryorder" && (
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
            />
          </div>
        )}
        {(tableName === "inventoryorder" || tableName === "customerorder") && (
          <>
            <div className="py-5">
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
                defaultValue={deliverystatus[0]}
                onChange={(status) => {
                  setFormData((prevFormData) => ({
                    ...prevFormData,
                    deliveryStatus: status,
                  }))
                }}
              />
            </div>
          </>
        )}
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
