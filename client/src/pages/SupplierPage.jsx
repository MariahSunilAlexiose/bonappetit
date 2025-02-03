import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom"

import axios from "axios"

const SupplierPage = () => {
  const { supplierName } = useParams()
  const [supplier, setSupplier] = useState({})

  useEffect(() => {
    const fetchMenuData = async () => {
      try {
        const res = await axios.get(`/get_supplier/${supplierName}`)
        setSupplier(res.data[0])
      } catch (err) {
        console.log("Error fetching menu:", err)
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
    </div>
  )
}

export default SupplierPage
