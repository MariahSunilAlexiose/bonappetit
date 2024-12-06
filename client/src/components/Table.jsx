import React, { useState } from "react"

import axios from "axios"
import PropTypes from "prop-types"
import { useNavigate } from "react-router-dom"

import Pagination from "./Pagination"

const keyMapping = {
  restaurantID: "Restaurant ID",
  name: "Name",
  address: "Address",
  phone: "Phone",
  rating: "Rating",
  customerID: "Customer ID",
  email: "Email",
  employeeID: "Employee ID",
  role: "Role",
  salary: "Salary",
  inventoryID: "Inventory ID",
  quantity: "Quantity",
  unitPrice: "Unit Price",
  supplierID: "Supplier ID",
  contactperson: "Contact Person",
  restaurantName: "Restaurant",
  supplierName: "Supplier",
}

const Table = ({ tableName, data }) => {
  const navigate = useNavigate()
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(5)
  const lastItemIndex = currentPage * itemsPerPage
  const firstItemIndex = lastItemIndex - itemsPerPage
  const currentItems = data.slice(firstItemIndex, lastItemIndex)

  if (!data || data.length === 0) {
    return <div>No data available</div>
  }

  const headers = Object.keys(data[0]).map((key) => keyMapping[key] || key)

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/delete_${tableName}/${id}`)
      window.location.reload()
    } catch (err) {
      console.log("Error deleting data:", err)
    }
  }

  let toBeUpdatedKeys = Object.keys(data[0])
  return (
    <div className="relative w-full overflow-auto text-center">
      <table className="w-full text-sm justify-center items-center">
        <thead className="[&_tr]:border-b">
          <tr className="border-b transition-colors">
            {headers.map((header) => (
              <th
                key={header}
                className="w-[100px] h-10 px-4 text-center align-middle font-bold"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="[&_tr:last-child]:border-0">
          {currentItems.map((row, index) => (
            <tr
              key={index}
              className="border-b transition-colors cursor-pointer hover:bg-[#f1f5f9]"
            >
              {Object.keys(data[0]).map((header) => (
                <td key={header} className="w-1/6 font-medium p-2 align-middle">
                  {row[header]}
                </td>
              ))}
              <td className="w-1/6 flex font-medium p-2 align-middle">
                <button
                  onClick={() =>
                    navigate("/edit_form", {
                      state: {
                        toBeUpdatedKeys,
                        tableName,
                        dataToBeUpdated: row,
                      },
                    })
                  }
                  className="mr-1 bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => {
                    if (tableName === "supplier") {
                      handleDelete(row.supplierID)
                    } else if (tableName === "customer") {
                      handleDelete(row.customerID)
                    } else if (tableName === "employee") {
                      handleDelete(row.employeeID)
                    } else if (tableName === "inventory") {
                      handleDelete(row.inventoryID)
                    } else {
                      handleDelete(row.restaurantID)
                    }
                  }}
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="pt-5">
        <Pagination
          totalItems={data.length}
          itemsPerPage={itemsPerPage}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
      </div>
    </div>
  )
}

Table.propTypes = {
  tableName: PropTypes.string.isRequired,
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
}

export default Table
