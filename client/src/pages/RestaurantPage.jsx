import React, { useEffect, useState } from "react"

import axios from "axios"
import { useNavigate, useParams } from "react-router-dom"

import { PlusIcon } from "../assets/icons"
import { Table } from "../components"

const RestaurantPage = () => {
  const { restaurantName } = useParams()
  const navigate = useNavigate()
  const [restaurant, setRestaurant] = useState({})
  const [menuTable, setMenuTable] = useState([])
  const [menu, setMenu] = useState([])
  const [lastID, setLastID] = useState(0)

  useEffect(() => {
    const fetchMenuData = async () => {
      try {
        const res = await axios.get(`/get_restaurant/${restaurantName}`)
        setRestaurant(res.data[0])
        const totalNo = await axios.get("/menuitems")
        setLastID(Math.max(...totalNo.data.map((item) => item.menuitemID)))
        const resMenu = await axios.get(`/get_menu/${restaurantName}`)
        setMenu(resMenu.data)
        const updatedMenu = resMenu.data.map((item) => {
          // eslint-disable-next-line no-unused-vars
          const { restaurantID, ...rest } = item
          return { ...rest }
        })
        setMenuTable(updatedMenu)
      } catch (err) {
        console.log("Error fetching menu:", err)
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
          className="mr-1 bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded-full"
          onClick={() => {
            navigate("/add_form", {
              state: {
                toBeAddedKeys: Object.keys(menu[0]).filter(
                  (key) => key !== "restaurantID" && key !== "menuitemID"
                ),
                lastID: lastID,
                tableName: "menuitem",
                id: menu[0].restaurantID,
              },
            })
          }}
        >
          <img alt="Plus Icon" src={PlusIcon} width={20} height={20} />
        </button>
      </div>
      <Table data={menuTable} tableName="menuitem" />
    </div>
  )
}

export default RestaurantPage
