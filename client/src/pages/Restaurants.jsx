import React, { useEffect, useState } from "react"

import axios from "axios"
import { useNavigate } from "react-router-dom"

import { PlusIcon } from "../assets/icons"
import { Table } from "../components"

const Restaurants = () => {
  const navigate = useNavigate()
  const [restaurants, setRestaurants] = useState([])

  const tableName = "restaurant"

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("/restaurants")
        setRestaurants(res.data)
      } catch (err) {
        console.log(err)
      }
    }

    fetchData()
  }, [])

  const lastID = Math.max(...restaurants.map((item) => item.restaurantID))

  let toBeUpdatedKeys = []

  if (restaurants && restaurants.length > 0) {
    toBeUpdatedKeys = Object.keys(restaurants[0]).filter(
      (key) => key !== "restaurantID"
    )
  }

  return (
    <div className="py-10">
      <div className="flex justify-between">
        <h1>Restaurants</h1>
        <button
          className="mr-1 bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded-full"
          onClick={() =>
            navigate("/add_form", {
              state: { toBeUpdatedKeys, lastID, tableName },
            })
          }
        >
          <img alt="Plus Icon" src={PlusIcon} width={20} height={20} />
        </button>
      </div>
      <div className="pt-7">
        <Table data={restaurants} />
      </div>
    </div>
  )
}

export default Restaurants
