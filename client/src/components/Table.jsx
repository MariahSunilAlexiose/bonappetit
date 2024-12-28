import React, { useState } from "react"

import axios from "axios"
import PropTypes from "prop-types"
import { useNavigate } from "react-router-dom"

import { keyMapping } from "../constants"

import Pagination from "./Pagination"

const handleDelete = async (id, tableName) => {
  try {
    await axios.delete(`/delete_${tableName}/${id}`)
    window.location.reload()
  } catch (err) {
    console.log("Error deleting data:", err)
  }
}

const formatDate = (dateString) => {
  const options = { day: "numeric", month: "short", year: "numeric" }
  const formattedDate = new Intl.DateTimeFormat("en-US", options).format(
    new Date(dateString)
  )
  const [month, day, year] = formattedDate.replace(",", "").split(" ")
  return `${day} ${month} ${year}`
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
      <table className="w-full text-sm justify-center items-center">
        <thead className="[&_tr]:border-b">
          <tr className="border-b transition-colors">
            {Object.keys(data[0])
              .map((key) => keyMapping[key] || key)
              .map((header) => (
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
              className={`border-b transition-colors cursor-pointer ${tableName !== "employee" && tableName !== "menuitem" && tableName !== "inventory" && tableName !== "inventoryorderitem" && tableName !== "customerorderitem" && tableName !== "supplier" && `hover:bg-[#f1f5f9]`}`}
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
                  className={`w-1/6 font-medium p-2 align-middle ${row[header] === "Not Delivered" ? "text-red-500" : row[header] === "Completed" ? "text-green-600" : row[header] === "Delivered" ? "text-blue-600" : row[header] === "In Transit" ? "text-orange-400" : row[header] === "Pending" ? "text-pink-600" : ""}`}
                >
                  {header === "unitPrice" || header === "price"
                    ? `$${row[header]}`
                    : header === "date"
                      ? formatDate(row[header])
                      : row[header]}
                </td>
              ))}
              <td className="w-1/6 font-medium p-2 align-middle flex">
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
                  className="mr-1 bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded"
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
