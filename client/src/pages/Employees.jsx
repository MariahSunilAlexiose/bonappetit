import React, { useEffect, useState } from "react"

import axios from "axios"

import { Table } from "../components"

const Employees = () => {
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
      </div>
      <div className="pt-7">
        <Table data={employees} tableName="employee" />
      </div>
    </div>
  )
}

export default Employees
