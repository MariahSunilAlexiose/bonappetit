import React, { useState } from "react"
import { useNavigate } from "react-router-dom"

import axios from "axios"
import PropTypes from "prop-types"

import { formatDate, keyMapping } from "../constants"

import Pagination from "./Pagination"

const handleDelete = async (id, tableName) => {
  try {
    await axios.delete(`/delete_${tableName}/${id}`)
    window.location.reload()
  } catch (err) {
    console.log("Error deleting data:", err)
  }
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

  return (
    <div className="relative w-full overflow-auto text-center">
      <table className="w-full items-center justify-center text-sm">
        <thead className="[&_tr]:border-b">
          <tr className="border-b transition-colors">
            {Object.keys(data[0])
              .map((key) => keyMapping[key] || key)
              .map((header) => (
                <th
                  key={header}
                  className="h-10 w-[100px] px-4 text-center align-middle font-bold"
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
              className={`cursor-pointer border-b transition-colors ${tableName !== "employee" && tableName !== "menuitem" && tableName !== "inventory" && tableName !== "inventoryorderitem" && tableName !== "customerorderitem" && tableName !== "supplier" && `hover:bg-[#f1f5f9]`}`}
              onClick={() => {
                if (tableName === "inventoryorder") {
                  navigate(`inventoryorder/${row["inventoryOrderID"]}`)
                } else if (tableName === "customerorder") {
                  navigate(`customerorder/${row["customerOrderID"]}`)
                } else if (
                  tableName !== "employee" &&
                  tableName !== "menuitem" &&
                  tableName !== "inventory" &&
                  tableName !== "inventoryorderitem" &&
                  tableName !== "supplier"
                ) {
                  const currentPath = window.location.pathname
                  navigate(`${currentPath}/${row["name"]}`)
                }
              }}
            >
              {Object.keys(data[0]).map((header) => (
                <td
                  key={header}
                  className={`w-1/6 p-2 align-middle ${row[header] === "Not Delivered" ? "text-red-500" : row[header] === "Completed" ? "text-green-600" : row[header] === "Delivered" ? "text-blue-600" : row[header] === "In Transit" ? "text-orange-400" : row[header] === "Pending" ? "text-pink-600" : ""}`}
                >
                  {header === "unitPrice" ||
                  header === "price" ||
                  header === "salary"
                    ? `$${row[header]}`
                    : header === "date"
                      ? formatDate(row[header])
                      : row[header]}
                </td>
              ))}
              <td className="w-1/6 p-2 align-middle">
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    navigate("/edit_form", {
                      state: {
                        tableName,
                        dataToBeUpdated: row,
                      },
                    })
                  }}
                  className="mr-1 rounded bg-blue-500 px-2 py-1 text-white hover:bg-blue-700"
                >
                  Edit
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    // console.log(row, tableName)
                    if (tableName === "supplier") {
                      handleDelete(row.supplierID, tableName)
                    } else if (tableName === "customer") {
                      handleDelete(row.customerID, tableName)
                    } else if (tableName === "employee") {
                      handleDelete(row.employeeID, tableName)
                    } else if (tableName === "inventory") {
                      handleDelete(row.inventoryID, tableName)
                    } else if (tableName === "menuitem") {
                      handleDelete(row.menuitemID, tableName)
                    } else if (tableName === "customerorder") {
                      handleDelete(row.customerOrderID, tableName)
                    } else {
                      handleDelete(row.restaurantID, tableName)
                    }
                  }}
                  className="rounded bg-red-500 px-2 py-1 text-white hover:bg-red-700"
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
