import React, { use, useEffect, useState } from "react"

import axios from "axios"
import { useLocation, useNavigate } from "react-router-dom"

import { DropDown, Input, InputDropDown } from "../components"
import { deliveryStatus, keyMapping, paymentStatus } from "../constants"

const formatDate = (dateString) => {
  const date = new Date(dateString)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

const EditForm = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { tableName, dataToBeUpdated } = location.state || {}
  const [formData, setFormData] = useState(dataToBeUpdated)
  const [menuItems, setMenuItems] = useState([])
  const [originalMenuItemID, setOriginalMenuItemID] = useState(null)
  const [menuItem, setMenuItem] = useState([])
  const [restaurants, setRestaurants] = useState([])
  const [restaurant, setRestaurant] = useState(null)
  const [currentDate, setCurrentDate] = useState(
    new Date().toISOString().slice(0, 10)
  )

  let toBeUpdatedKeys = Object.keys(formData).filter((key) => {
    return (
      key !== `${tableName}ID` &&
      (tableName !== "menuitem" || key !== "restaurantID") &&
      (tableName !== "customerorderitem" || key !== "customerorderID") &&
      (tableName !== "customerorder" || (key !== "customerID" && key !== "restaurantID"))
    );
  });  

  const getMenu = async (restaurantName) => {
    try {
      const res = await axios.get(`/get_menu/${restaurantName}`)
      setMenuItems(res.data)
    } catch (err) {
      console.log(err)
    }
  }

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

  const handleMenuItemChange = async (newMenuItemID) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      menuitemID: newMenuItemID,
    }))
    setMenuItem(newMenuItemID)
  }

  const handleAddMenuItem = () => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      items: [...prevFormData.items, { menuitemID: 0, quantity: 1 }],
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      if(tableName === "customerorderitem") {
        console.log(formData.menuitemID, formData.quantity, formData.customerorderID, originalMenuItemID);
        await axios.post(`/edit_customerorderitem/${originalMenuItemID}`, {
          ...formData,
        });
      } else {
        await axios.post(`/edit_${tableName}/${formData[`${tableName}ID`]}`, {
          ...formData,
        });
      }
      navigate(-1);   
    } catch (err) {
      console.error("Error in adding:", err);
    }
  };  

  useEffect(() => {
    if (tableName === "customerorderitem") {
      const fetchData = async () => {
        try {
          const res = await axios.get(
            `/get_customerorder/${formData.customerorderID}`
          )
          const resName = await axios.get(
            `/get_restaurant_name/${res.data[0].restaurantID}`
          )
          getMenu(resName.data[0].name)
        } catch (err) {
          console.log(err)
        }
      }
      fetchData()
    }

    if (formData.menuitemID) {
      const fetchMenuItem = async () => {
        try {
          const res = await axios.get(
            `/get_menuitem/${formData.menuitemID}`
          )
          setOriginalMenuItemID(dataToBeUpdated.menuitemID)
          setMenuItem(res.data[0])
        } catch (err) {
          console.log(err)
        }
      }
      fetchMenuItem()
    }
  }, [tableName, dataToBeUpdated.menuitemID, formData.customerorderID, formData.menuitemID])

  return (
    <div className="pt-10">
      <h1>
        Edit in{" "}
        {tableName === "menuitem"
          ? "Menu Item"
          : tableName === "customerorder"
            ? "Customer Order"
            : tableName === "customerorderitem"
              ? "Customer Order Item"
              : tableName.charAt(0).toUpperCase() +
                tableName.slice(1).toLowerCase()}{" "}
        Table
      </h1>
      <form onSubmit={handleSubmit}>
        {toBeUpdatedKeys.map((key, index) =>
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
                    const filteredmenuItems = menuItems.filter(
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
                          options={filteredmenuItems}
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
                defaultValue={formData.paymentStatus}
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
                defaultValue={formData.deliveryStatus}
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
                value={formatDate(formData.date)}
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
            <div className="py-5" key={index}>
              <label
                htmlFor="menuitem"
                className="block text-sm font-medium text-gray-700"
              >
                Menu Item
              </label>
              <InputDropDown
                label="menuitem"
                options={menuItems}
                defaultValue={menuItem.name || ""}
                onChange={handleMenuItemChange}
              />
            </div>
          ) : (
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
                    [name]: key === "rating" || key === "salary" || key === "unitPrice" || key === "price" || key === "quantity" ? Number(value) : value,
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
          )
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
