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
        const res = await axios.get("/employee_view")
        setEmployees(res.data)
      } catch (err) {
        console.log(err)
      }
    }

    fetchData()
  }, [])
  return (
    <div className="py-10">
      <div className="flex justify-between">
        <h1>Employees</h1>
        <button
          className="mr-1 bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded-full"
          onClick={() =>
            navigate("/add_form", {
              state: {
                toBeAddedKeys: Object.keys(employees[0]).filter(
                  (key) => key !== "restaurantName" && key !== "employeeID"
                ),
                lastID: employees.length
                  ? Math.max(...employees.map((item) => item.employeeID))
                  : 0,
                tableName: "employee",
              },
            })
          }
        >
          <img alt="Plus Icon" src={PlusIcon} width={20} height={20} />
        </button>
      </div>
      <div className="pt-7">
        <Table data={employees} tableName="employee" />
      </div>
    </div>
  )
}

export default Employees
