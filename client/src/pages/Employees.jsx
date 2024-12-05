import React, { useEffect, useState } from "react"

import axios from "axios"
import { useNavigate } from "react-router-dom"

import { PlusIcon } from "../assets/icons"
import { Table } from "../components"

const Employees = () => {
  const navigate = useNavigate()
  const [employees, setEmployees] = useState([])
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("/employees")
        const restID = await axios.get("/restaurants")
        const restIDMapping = {}
        restID.data.forEach((restaurant) => {
          restIDMapping[restaurant.restaurantID] = restaurant.name
        })
        const updatedEmployees = res.data.map((item) => {
          const { restaurantID, ...rest } = item // eslint-disable-line no-unused-vars
          return {
            ...rest,
            restaurantName:
              restIDMapping[item.restaurantID] || item.restaurantID,
          }
        })
        setEmployees(updatedEmployees)
      } catch (err) {
        console.log(err)
      }
    }

    fetchData()
  }, [])
  let tableName = "employee"
  let toBeUpdatedKeys = []
  const lastID = Math.max(...employees.map((item) => item.employeeID))

  if (employees && employees.length > 0) {
    toBeUpdatedKeys = Object.keys(employees[0]).filter(
      (key) => key !== "employeeID" && key !== "restaurantName"
    )
  }
  return (
    <div className="py-10">
      <div className="flex justify-between">
        <h1>Employees</h1>
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
        <Table data={employees} />
      </div>
    </div>
  )
}

export default Employees
