import React, { useEffect, useState } from "react"

import axios from "axios"

import { Table } from "../components"

const Restaurants = () => {
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
      </div>
      <div className="pt-7">
        <Table data={restaurants} tableName="restaurant" />
      </div>
    </div>
  )
}

export default Restaurants
