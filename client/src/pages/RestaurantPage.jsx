import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom"

import axios from "axios"

import { Table } from "../components"

const RestaurantPage = () => {
  const { restaurantName } = useParams()
  const [restaurant, setRestaurant] = useState({})
  // eslint-disable-next-line no-unused-vars
  const [menu, setMenu] = useState([])
  const [menuTable, setMenuTable] = useState([])

  useEffect(() => {
    const fetchMenuData = async () => {
      try {
        const res = await axios.get(`/get_restaurant/${restaurantName}`)
        setRestaurant(res.data[0])
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
      </div>
      <Table data={menuTable} tableName="menuitem" />
    </div>
  )
}

export default RestaurantPage
