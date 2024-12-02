import React, { useEffect, useState } from "react"

import axios from "axios"

import { Table } from "../components"

const Employees = () => {
  const [employees, setEmployees] = useState([])
  useEffect(() => {
    const fetchData = async () => {
      try {
        const employeesRes = await axios.get("/employees")
        setEmployees(employeesRes.data)
      } catch (err) {
        console.log(err)
      }
    }

    fetchData()
  }, [])
  return (
    <div>
      <h1 className="py-14">Employees</h1>
      <Table data={employees} />
    </div>
  )
}

export default Employees
