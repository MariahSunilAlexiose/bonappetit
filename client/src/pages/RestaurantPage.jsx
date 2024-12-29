import React, { useEffect, useState } from "react"

import axios from "axios"
import { useNavigate, useParams } from "react-router-dom"

import { PlusIcon } from "../assets/icons"
import { Table } from "../components"

const handleDelete = async (id, navigate) => {
  try {
    await axios.delete(`/delete_restaurant/${id}`)
    navigate(-1)
  } catch (err) {
    console.log("Error deleting data:", err)
  }
}

const RestaurantPage = () => {
  const { restaurantName } = useParams()
  const navigate = useNavigate()
  const [restaurant, setRestaurant] = useState({})
  const [menu, setMenu] = useState([])
  const [lastID, setLastID] = useState(0)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`/get_restaurant/${restaurantName}`)
        setRestaurant(res.data[0])
        const totalNo = await axios.get("/menuitems")
        setLastID(Math.max(...totalNo.data.map((item) => item.menuitemID)))
        const resMenu = await axios.get(`/get_menu/${restaurantName}`)
        setMenu(resMenu.data)
      } catch (err) {
        console.log("Error fetching menu:", err)
      }
    }

    fetchData()
  }, [restaurantName])

  return (
    <div className="py-14">
      <div className="flex justify-between">
        <div>
          <h1>{restaurantName}</h1>
          <h2>Address: {restaurant.address}</h2>
          <h2>Phone: {restaurant.phone}</h2>
          <h2>Rating: {restaurant.rating}</h2>
        </div>
        <div>
          <button
            onClick={(e) => {
              e.stopPropagation()
              navigate("/edit_form", {
                state: {
                  tableName: "restaurant",
                  dataToBeUpdated: restaurant,
                },
              })
            }}
            className="mr-1 bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded"
          >
            Edit
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation()
              handleDelete(restaurant.restaurantID, navigate)
            }}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
          >
            Delete
          </button>
        </div>
      </div>
      <br />
      <div className="flex justify-between">
        <h1>Menu</h1>
        <button
          className="mr-1 bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded-full"
          onClick={() => {
            navigate("/add_form", {
              state: {
                toBeAddedKeys: Object.keys(menu[0]).filter(
                  (key) => key !== "restaurantID" && key !== "menuitemID"
                ),
                lastID: lastID,
                tableName: "menuitem",
                fromId: menu[0].restaurantID,
              },
            })
          }}
        >
          <img alt="Plus Icon" src={PlusIcon} width={20} height={20} />
        </button>
      </div>
      <Table data={menu} tableName="menuitem" />
    </div>
  )
}

export default RestaurantPage
