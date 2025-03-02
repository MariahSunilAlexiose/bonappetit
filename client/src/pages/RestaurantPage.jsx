import React, { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"

import axios from "axios"

import { PlusIcon } from "../assets/icons"
import { Table } from "../components"

const RestaurantPage = () => {
  const { restaurantName } = useParams()
  const [restaurant, setRestaurant] = useState({})
  const [menu, setMenu] = useState([])

  const navigate = useNavigate()
  const [lastID, setLastID] = useState(0)

  useEffect(() => {
    const fetchMenuData = async () => {
      try {
        const res = await axios.get(`/get_restaurant_by_name/${restaurantName}`)
        setRestaurant(res.data[0])
        const totalNo = await axios.get("/menuitems")
        setLastID(
          totalNo.data.length > 0
            ? Math.max(...totalNo.data.map((item) => item.menuitemID))
            : 0
        )
        const resMenu = await axios.get(`/get_menu/${restaurantName}`)
        setMenu(resMenu.data)
      } catch (err) {
        console.log(err)
      }
    }

    fetchMenuData()
  }, [restaurantName])

  return (
    <div className="py-14">
      <h1>{restaurantName}</h1>
      <h2>Address: {restaurant.address}</h2>
      <h2>Phone: {restaurant.phone}</h2>
      <h2>Rating: {restaurant.rating}</h2>
      <br />
      <div className="flex justify-between">
        <h1>Menu</h1>
        <button
          className="mr-5 rounded-full bg-green-500 px-2 py-1 font-bold text-white hover:bg-green-700"
          onClick={() => {
            navigate("/add_form", {
              state: {
                toBeAddedKeys: ["name", "price", "description"],
                lastID: lastID,
                tableName: "menuitem",
                id: restaurant.restaurantID,
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
