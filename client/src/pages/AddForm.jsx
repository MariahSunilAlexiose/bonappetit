import React, { useEffect, useState } from "react"

import axios from "axios"
import { useLocation, useNavigate } from "react-router-dom"

import { DropDown, Input, InputDropDown } from "../components"
import { deliveryStatus, keyMapping, paymentStatus } from "../constants"

const fetchRestaurantNameFromCustomerOrderID = async (customerorderID) => {
  try {
    const res = await axios.get(`/get_customerorder/${customerorderID}`)
    const resName = await axios.get(
      `/get_restaurant_name/${res.data[0].restaurantID}`
    )
    return resName.data[0].name
  } catch (err) {
    console.log(err)
  }
}

const AddForm = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { toBeAddedKeys, lastID, tableName, fromId } = location.state || {}
  const [restaurants, setRestaurants] = useState([])
  const [restaurant, setRestaurant] = useState(null)
  const [menuItem, setMenuItem] = useState([])
  const [menuItems, setMenuItems] = useState([])
  const [formData, setFormData] = useState({} | [])
  const [currentDate, setCurrentDate] = useState(
    new Date().toISOString().slice(0, 10)
  )

  const handleRestaurantChange = async (newRestaurantID) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      restaurantID: newRestaurantID,
    }))
    setRestaurant(newRestaurantID)
    try {
      const resName = await axios.get(`/get_restaurant_name/${newRestaurantID}`)
      getMenu(resName.data[0].name)
    } catch (err) {
      console.log(err)
    }
  }

  const getMenu = async (restaurantName) => {
    try {
      const res = await axios.get(`/get_menu/${restaurantName}`)
      console.log(restaurantName)
      setMenuItems(res.data)
    } catch (err) {
      console.log(err)
    }
  }

  const handleMenuItemChange = async (newMenuItemID) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      menuitemID: newMenuItemID,
    }))
    setMenuItem(newMenuItemID)
  }

  const handleChange = (key) => (e) => {
    const { name, value } = e.target
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: key === "rating" || key === "salary" || key === "unitPrice" || key === "price" || key === "quantity" ? Number(value) : value,
    }))
  }

  const handleAddMenuItem = () => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      items: [...prevFormData.items, { menuitemID: 0, quantity: 1 }],
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (tableName === "menuitem") {
        await axios.post(`/add_menuitem`, {
          ...formData,
          menuitemID: lastID + 1,
          restaurantID: fromId,
        })
      } else if (tableName === "customerorder") {
        await axios.post(`/add_customerorder`, {
          ...formData,
          customerorderID: lastID + 1,
          customerID: fromId,
        })
      } else if (tableName === "customerorderitem") {
        await axios.post(`/add_customerorderitem`, {
          ...formData,
          customerorderID: lastID,
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const restRes = await axios.get("/restaurants")
        setRestaurants(restRes.data)
        if (tableName === "customerorder") {
          setFormData((prevFormData) => ({
            ...prevFormData,
            date: currentDate,
            items: [{ menuitemID: 0, quantity: 1 }],
            paymentStatus: paymentStatus[0],
            deliveryStatus: deliveryStatus[0],
          }))
        }
      } catch (err) {
        console.log(err)
      }
    }
    fetchData()

    if (tableName === "customerorderitem") {
      const processCustomerOrderItem = async () => {
        try {
          const restaurantName =
            await fetchRestaurantNameFromCustomerOrderID(lastID)
          await getMenu(restaurantName)
        } catch (err) {
          console.log(err)
        }
      }
      processCustomerOrderItem()
    }
  }, [tableName, lastID, currentDate])

  console.log(toBeAddedKeys, lastID, tableName, fromId, formData)

  return (
    <div className="pt-10">
      <h1>
        Add to{" "}
        {tableName === "menuitem"
          ? "Menu Item"
          : tableName === "customerorder"
            ? "Customer Order"
            : tableName === "customerorderitem"
              ? "Customer Order Item"
              : tableName.charAt(0).toUpperCase() +
                tableName.slice(1).toLowerCase()}
      </h1>
      <form onSubmit={handleSubmit}>
        {toBeAddedKeys &&
          toBeAddedKeys.map((key, index) =>
            key === "restaurantName" ? (
              <div className="py-5" key={index}>
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
                {formData.restaurantID && (
                  <div className="py-3">
                    {formData.items.map((item, index) => {
                      // Filter out already selected menu items
                      const filteredMenuItems = menuItems.filter(
                        (menuitem) =>
                          !formData.items.some(
                            (i) => i.menuitemID === menuitem.menuitemID
                          )
                      )
                      return (
                        <div key={index} className="py-3">
                          <label
                            htmlFor={`menuitem-${index}`}
                            className="block text-sm font-medium text-gray-700"
                          >
                            Menu Item
                          </label>
                          <InputDropDown
                            label="menuitem"
                            options={filteredMenuItems}
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
                            value={item.quantity !== null ? item.quantity : ''}
                            onChange={(e) => {
                              const value = e.target.value;
                              setFormData((prevFormData) => {
                                const updatedItems = prevFormData.items.map((i, idx) =>
                                  idx === index ? { ...i, quantity: value === '' ? null : Number(value) } : i
                                );
                                return { ...prevFormData, items: updatedItems };
                              });
                            }}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                            min={1}
                            required
                          />
                        </div>
                      )
                    })}
                    {menuItems.length > formData.items.length && (
                      <button
                        type="button"
                        className="mt-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        onClick={handleAddMenuItem}
                      >
                        Add Menu Item
                      </button>
                    )}
                  </div>
                )}
              </div>
            ) : key === "paymentStatus" ? (
              <div className="py-5" key={index}>
                <label
                  htmlFor="payment"
                  className="block text-sm font-medium text-gray-700"
                >
                  Payment Status
                </label>
                <DropDown
                  options={paymentStatus}
                  defaultValue={paymentStatus[0]}
                  onChange={(statusKey) => {
                    setFormData((prevFormData) => ({
                      ...prevFormData,
                      paymentStatus: statusKey,
                    }))
                  }}
                />
              </div>
            ) : key === "deliveryStatus" ? (
              <div className="py-5" key={index}>
                <label
                  htmlFor="delivery"
                  className="block text-sm font-medium text-gray-700"
                >
                  Delivery Status
                </label>
                <DropDown
                  options={deliveryStatus}
                  defaultValue={deliveryStatus[0]}
                  onChange={(statusKey) => {
                    setFormData((prevFormData) => ({
                      ...prevFormData,
                      deliveryStatus: statusKey,
                    }))
                  }}
                />
              </div>
            ) : key === "date" ? (
              <div className="py-5" key={index}>
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
            ) : key === "menuitemName" || key === "menuitemID" ? (
              <div className="py-5">
                <label
                  htmlFor="menuitem"
                  className="block text-sm font-medium text-gray-700"
                >
                  Menu Item
                </label>
                <InputDropDown
                  label="menuitem"
                  options={menuItems}
                  onChange={handleMenuItemChange}
                />
              </div>
            ) : (
              <div key={index} className="py-5">
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
                  onChange={handleChange(key)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  step={
                    key === "rating"
                      ? "0.1"
                      : key === "salary" || key === "unitPrice" || key === "price"
                        ? "0.01"
                        : undefined
                  }
                  min={
                    key === "rating" || key === "unitPrice" || key === "price"
                      ? "0"
                      : key === "salary"
                        ? "17.30"
                        : undefined
                  }
                  max={key === "rating" ? "5" : undefined}
                  required
                />
              </div>
            )
          )}

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
