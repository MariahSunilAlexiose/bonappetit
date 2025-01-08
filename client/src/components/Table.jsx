import React, { useEffect, useState } from "react"

import axios from "axios"
import PropTypes from "prop-types"
import { useNavigate } from "react-router-dom"

import { keyMapping } from "../constants"

import Pagination from "./Pagination"

const handleEdit = async (navigate, tableName, originalRow) => {
  // console.log(tableName, originalRow)
  // if (tableName === "customerorderitem") {
    // const restaurantName = fetchRestaurantNameFromCustomerOrderID(originalRow)
    navigate("/edit_form", {
      state: {
        tableName,
        dataToBeUpdated: originalRow, // send menuitemID (instead of menuitemName) and restaurantName
      },
    })
  // }
}

const handleDelete = async (tableName, row, orderID, itemID) => {
  const idKey = `${tableName}ID`
  try {
    if (tableName === "customerorderitem") {
      await axios.delete(`/delete_customerorderitem/${orderID}/${itemID}`)
    } else {
      await axios.delete(`/delete_${tableName}/${row[idKey]}`)
    }
    window.location.reload()
  } catch (err) {
    console.log("Error deleting data:", err)
  }
}

const directPage = async (navigate, tableName, row) => {
  if (tableName === "inventoryorder") {
    navigate(`inventoryorder/${row["inventoryOrderID"]}`)
  } else if (tableName === "customerorder") {
    navigate(`${row["customerorderID"]}`)
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
}

const formatDate = (dateString) => {
  const options = { day: "numeric", month: "short", year: "numeric" }
  const formattedDate = new Intl.DateTimeFormat("en-US", options).format(
    new Date(dateString)
  )
  const [month, day, year] = formattedDate.replace(",", "").split(" ")
  return `${day} ${month} ${year}`
}

const replaceID = async (item) => {
  try {
    const res = await axios.get(`/get_menuitem/${item.menuitemID}`)
    const { menuitemID, ...rest } = item
    return {
      menuitemName: res.data[0].name,
      ...rest,
    }
  } catch (err) {
    console.log(err)
    return item
  }
}

const Table = ({ tableName, data }) => {
  const navigate = useNavigate()
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(5)
  const [filteredData, setFilteredData] = useState([])
  const lastItemIndex = currentPage * itemsPerPage
  const firstItemIndex = lastItemIndex - itemsPerPage

  useEffect(() => {
    const processItems = async () => {
      try {
        let updatedItems = data
        if (tableName === "customerorderitem") {
          updatedItems = await Promise.all(
            data.map(async (item) => {
              const originalRow = { ...item } // Preserve the original item
              const updatedItem = await replaceID(item)
              const filteredItem = Object.keys(updatedItem)
                .filter(
                  (key) =>
                    key !== "customerorderID" &&
                    key !== "restaurantID" &&
                    key !== "customerID"
                )
                .reduce((obj, key) => {
                  obj[key] = updatedItem[key]
                  return obj
                }, {})
              filteredItem.originalRow = originalRow // Assign the original item
              return filteredItem
            })
          )
        } else {
          updatedItems = data.map((item) => {
            const newItem = Object.keys(item)
              .filter((key) => key !== "restaurantID" && key !== "customerID")
              .reduce((obj, key) => {
                obj[key] = item[key]
                return obj
              }, {})
            newItem.originalRow = item
            return newItem
          })
        }
        setFilteredData(updatedItems)
      } catch (err) {
        console.error("Error processing items:", err)
      }
    }

    processItems()
  }, [data, tableName])

  if (!filteredData || filteredData.length === 0) {
    return <div>No data available</div>
  }

  const currentItems = filteredData.slice(firstItemIndex, lastItemIndex)

  return (
    <div className="relative w-full overflow-auto text-center">
      <table className="w-full text-sm justify-center items-center">
        <thead className="[&_tr]:border-b">
          <tr className="border-b transition-colors">
            {Object.keys(filteredData[0])
              .filter((key) => key !== "originalRow")
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
              className={`border-b transition-colors cursor-pointer ${
                tableName !== "employee" &&
                tableName !== "menuitem" &&
                tableName !== "inventory" &&
                tableName !== "inventoryorderitem" &&
                tableName !== "customerorderitem" &&
                tableName !== "supplier" &&
                tableName !== "customerorder" &&
                `hover:bg-[#f1f5f9]`
              }`}
              onClick={() => tableName !== "customerorderitem" ? directPage(navigate, tableName, row): ''}
            >
              {Object.keys(filteredData[0])
                .filter((key) => key !== "originalRow")
                .map((header) => (
                  <td
                    key={header}
                    className={`w-1/6 font-medium p-2 align-middle ${
                      row[header] === "Not Delivered"
                        ? "text-red-500"
                        : row[header] === "Completed"
                          ? "text-green-600"
                          : row[header] === "Delivered"
                            ? "text-blue-600"
                            : row[header] === "In Transit"
                              ? "text-orange-400"
                              : row[header] === "Pending"
                                ? "text-pink-600"
                                : ""
                    }`}
                  >
                    {header === "unitPrice" || header === "price"
                      ? `$${row[header]}`
                      : header === "date"
                        ? formatDate(row[header])
                        : row[header]}
                  </td>
                ))}
              {tableName !== "restaurant" &&
                tableName !== "customer" &&
                tableName !== "customerorder" && (
                  <td className="w-1/6 font-medium p-2 align-middle flex">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleEdit(navigate, tableName, row.originalRow)
                      }}
                      className="mr-1 bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        if (tableName === "customerorderitem") {
                          handleDelete(
                            tableName,
                            row,
                            row.originalRow.customerorderID,
                            row.originalRow.menuitemID
                          )
                        } else {
                          handleDelete(tableName, row)
                        }
                      }}
                      className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
                    >
                      Delete
                    </button>
                  </td>
                )}
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
