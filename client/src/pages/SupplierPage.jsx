import React, { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"

import axios from "axios"

import { PlusIcon } from "../assets/icons"
import { Table } from "../components"

const SupplierPage = () => {
  const navigate = useNavigate()
  const { supplierName } = useParams()
  const [supplier, setSupplier] = useState({})
  const [supplierOrders, setSupplierOrders] = useState([])
  const [lastID, setLastID] = useState(0)

  useEffect(() => {
    const fetchMenuData = async () => {
      try {
        const res = await axios.get(`/get_supplier/${supplierName}`)
        setSupplier(res.data[0])
        const orders = await axios.get(
          `/get_inventoryorders_by_supplier/${res.data[0].supplierID}`
        )
        setSupplierOrders(orders.data)
        const all = await axios.get(`/get_inventoryorders`)
        setLastID(
          all.data.length > 0
            ? Math.max(...all.data.map((item) => item.inventoryorderID))
            : 0
        )
      } catch (err) {
        console.log(err)
      }
    }
    fetchMenuData()
  }, [supplierName])

  return (
    <div className="py-14">
      <h1>{supplierName}</h1>
      <h2>Address: {supplier.address}</h2>
      <h2>Phone: {supplier.phone}</h2>
      <h2>Contact Person: {supplier.contactPerson}</h2>
      <br />
      <div className="flex justify-between">
        <h1>Orders</h1>
        <button
          className="mr-5 rounded-full bg-green-500 px-2 py-1 font-bold text-white hover:bg-green-700"
          onClick={() =>
            navigate("/add_form", {
              state: {
                toBeAddedKeys: [
                  "supplierID",
                  "employeeID",
                  "restaurantID",
                  "date",
                  "paymentStatus",
                  "deliveryStatus",
                ],
                lastID: lastID,
                tableName: "supplierorder",
                id: supplier.supplierID,
              },
            })
          }
        >
          <img alt="Plus Icon" src={PlusIcon} width={20} height={20} />
        </button>
      </div>
      <Table data={supplierOrders} tableName="supplierorder" />
    </div>
  )
}

export default SupplierPage
