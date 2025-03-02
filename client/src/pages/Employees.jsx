import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

import axios from "axios"

import { PlusIcon } from "../assets/icons"
import { Table } from "../components"

const Employees = () => {
  const navigate = useNavigate()
  const [employees, setEmployees] = useState([])
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("/employees")
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
          className="mr-5 rounded-full bg-green-500 px-2 py-1 font-bold text-white hover:bg-green-700"
          onClick={() =>
            navigate("/add_form", {
              state: {
                toBeAddedKeys: [
                  "name",
                  "restaurantID",
                  "role",
                  "phone",
                  "address",
                  "salary",
                ],
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
