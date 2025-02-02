import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom"

import axios from "axios"

import { Table } from "../components"

const EmployeePage = () => {
  const { employeeName } = useParams()
  const [employee, setEmployee] = useState([])
  const [orders, setOrders] = useState([])
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`/get_employee/${employeeName}`)
        setEmployee(res.data[0])
        const resOrders = await axios.get(
          `/get_employeeorders/${res.data[0].employeeID}`
        )
        setOrders(resOrders.data)
        console.log(resOrders.data)
      } catch (err) {
        console.log(err)
      }
    }
    fetchData()
  }, [employeeName])
  return (
    <div className="py-14">
      <h1>{employeeName}</h1>
      <div className="flex gap-28">
        <div>
          <h2>Address: {employee.address}</h2>
          <h2>Phone: {employee.phone}</h2>
          <h2>Role: {employee.role}</h2>
        </div>
        <div>
          <h2>Restaurant: {employee.restaurantName}</h2>
          <h2>Salary: {employee.salary}</h2>
        </div>
      </div>
      <div className="flex justify-between pt-5">
        <h1>Orders made by {employeeName}</h1>
      </div>
      <Table data={orders} tableName="employeeorder" />
    </div>
  )
}

export default EmployeePage
