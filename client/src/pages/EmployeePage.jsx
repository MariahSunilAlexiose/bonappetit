import React, { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"

import axios from "axios"

import { PlusIcon } from "../assets/icons"
import { Table } from "../components"

const EmployeePage = () => {
  const navigate = useNavigate()
  const { employeeName } = useParams()
  const [employee, setEmployee] = useState([])
  const [orders, setOrders] = useState([])
  const [lastID, setLastID] = useState(0)
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`/get_employee/${employeeName}`)
        setEmployee(res.data[0])
        const resOrders = await axios.get(
          `/get_employeeorders/${res.data[0].employeeID}`
        )
        setOrders(resOrders.data)
        const totalNo = await axios.get("/customerorders")
        setLastID(
          totalNo.data.length > 0
            ? Math.max(...totalNo.data.map((item) => item.customerorderID))
            : 0
        )
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
        <button
          className="mr-5 rounded-full bg-green-500 px-2 py-1 font-bold text-white hover:bg-green-700"
          onClick={() => {
            navigate("/add_form", {
              state: {
                toBeAddedKeys: [
                  "date",
                  "customerID",
                  "restaurantID",
                  "employeeID",
                  "paymentStatus",
                  "deliveryStatus",
                ],
                lastID: lastID,
                tableName: "employeeorder",
                id: employee.employeeID,
              },
            })
          }}
        >
          <img alt="Plus Icon" src={PlusIcon} width={20} height={20} />
        </button>
      </div>
      <Table data={orders} tableName="employeeorder" />
    </div>
  )
}

export default EmployeePage
