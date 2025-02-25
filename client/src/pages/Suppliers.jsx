import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

import axios from "axios"

import { PlusIcon } from "../assets/icons"
import { Table } from "../components"

const Suppliers = () => {
  const navigate = useNavigate()
  const [suppliers, setSuppliers] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("/suppliers")
        setSuppliers(res.data)
      } catch (err) {
        console.log(err)
      }
    }
    fetchData()
  }, [])

  return (
    <div className="py-10">
      <div className="flex justify-between">
        <h1>Suppliers</h1>
        <button
          className="mr-5 rounded-full bg-green-500 px-2 py-1 font-bold text-white hover:bg-green-700"
          onClick={() =>
            navigate("/add_form", {
              state: {
                toBeAddedKeys: Object.keys(suppliers[0]).filter(
                  (key) => key !== "supplierID"
                ),
                lastID: Math.max(...suppliers.map((item) => item.supplierID)),
                tableName: "supplier",
              },
            })
          }
        >
          <img alt="Plus Icon" src={PlusIcon} width={20} height={20} />
        </button>
      </div>
      <div className="pt-7">
        <Table data={suppliers} tableName="supplier" />
      </div>
    </div>
  )
}

export default Suppliers
