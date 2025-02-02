import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom"

import axios from "axios"

const EmployeePage = () => {
  const { employeeName } = useParams()
  const [employee, setEmployee] = useState([])
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`/get_employee/${employeeName}`)
        console.log(res.data)
        setEmployee(res.data[0])
      } catch (err) {
        console.log(err)
      }
    }
    fetchData()
  }, [employeeName])
  return (
    <div className="py-14">
      <h1>{employeeName}</h1>
      <h2>Address: {employee.address}</h2>
      <h2>Phone: {employee.phone}</h2>
      <h2>Role: {employee.role}</h2>
      <h2>Restaurant: {employee.restaurantName}</h2>
      <h2>Salary: {employee.salary}</h2>
    </div>
  )
}

export default EmployeePage
