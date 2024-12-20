import React, { useEffect, useState } from "react"

import axios from "axios"
import { useNavigate } from "react-router-dom"

import { PlusIcon } from "../assets/icons"
import { Table } from "../components"

const Restaurants = () => {
  const navigate = useNavigate()
  const [restaurants, setRestaurants] = useState([])

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

  return (
    <div className="py-10">
      <div className="flex justify-between">
        <h1>Restaurants</h1>
        <button
          className="mr-1 bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded-full"
          onClick={() =>
            navigate("/add_form", {
              state: {
                toBeAddedKeys: Object.keys(restaurants[0]).filter(
                  (key) => key !== "restaurantID"
                ),
                lastID: Math.max(
                  ...restaurants.map((item) => item.restaurantID)
                ),
                tableName: "restaurant",
              },
            })
          }
        >
          <img alt="Plus Icon" src={PlusIcon} width={20} height={20} />
        </button>
      </div>
      <div className="pt-7">
        <Table data={restaurants} tableName="restaurant" />
      </div>
    </div>
  )
}

export default Restaurants
