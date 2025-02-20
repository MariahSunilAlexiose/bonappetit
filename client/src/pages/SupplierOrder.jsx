import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom"

import axios from "axios"

import { Table } from "../components"
import { formatDate } from "../constants"

const SupplierOrder = () => {
  const { orderID } = useParams()
  const [supplierOrder, setSupplierOrder] = useState([])
  const [supplierOrderItems, setSupplierOrderItems] = useState([])
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`/get_inventoryorder/${orderID}`)
        setSupplierOrder(res.data[0])
        const resItems = await axios.get(`/get_inventoryorderitems/${orderID}`)
        setSupplierOrderItems(resItems.data)
      } catch (err) {
        console.log(err)
      }
    }
    fetchData()
  }, [orderID])
  return (
    <div className="py-14">
      <h1>Supplier Order</h1>
      <div className="flex gap-28">
        <div>
          {supplierOrder.date && (
            <h2>Date: {formatDate(supplierOrder.date)}</h2>
          )}
          <h2>Restaurant Name: {supplierOrder.restaurantName}</h2>
          <h2>Employee Name: {supplierOrder.employeeName}</h2>
        </div>
        <div>
          <h2>Supplier Name: {supplierOrder.supplierName}</h2>
          <h2>Payment Status: {supplierOrder.paymentStatus}</h2>
          <h2>Delivery Status: {supplierOrder.deliveryStatus}</h2>
        </div>
      </div>
      <div className="pt-7">
        <div>
          <h1>Supplier Order Details</h1>
        </div>
        <Table data={supplierOrderItems} tableName="supplierorderitem" />
      </div>
    </div>
  )
}

export default SupplierOrder
