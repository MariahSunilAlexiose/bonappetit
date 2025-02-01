import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom"

import axios from "axios"

const RestaurantPage = () => {
  const { restaurantName } = useParams()
  const [restaurant, setRestaurant] = useState({})

  useEffect(() => {
    const fetchMenuData = async () => {
      try {
        const res = await axios.get(`/get_restaurant/${restaurantName}`)
        setRestaurant(res.data[0])
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
    </div>
  )
}

export default RestaurantPage
