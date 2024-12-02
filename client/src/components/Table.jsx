import React, { useState } from "react"

import PropTypes from "prop-types"

import Pagination from "./Pagination"

const Table = ({ data }) => {
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(5)

  if (data.length === 0) {
    return <p>No data available.</p>
  }

  const mapKeysToTitles = (data) => {
    if (!data.length) return []

    const keyTitleMap = {
      date: "Date",
      total: "Total",
      restaurantID: "Restaurant",
      customerID: "Customer",
      orderID: "Order #",
      employeeID: "Employee #",
      name: "Name",
      role: "Role",
      phone: "Phone Number",
      address: "Address",
      price: "Price",
      quantity: "Quantity",
      inventoryID: "Inventory #",
    }

    return Object.keys(data[0]).map((key) => ({
      key,
      title: keyTitleMap[key] || key,
    }))
  }

  const headers = mapKeysToTitles(data)

  const lastItemIndex = currentPage * itemsPerPage
  const firstItemIndex = lastItemIndex - itemsPerPage
  const currentItems = data.slice(firstItemIndex, lastItemIndex)

  const formatDate = (dateString) => {
    const options = { day: "numeric", month: "short", year: "numeric" }
    const formattedDate = new Intl.DateTimeFormat("en-US", options).format(
      new Date(dateString)
    )
    const [month, day, year] = formattedDate.replace(",", "").split(" ")
    return `${day} ${month} ${year}`
  }

  const formatTotal = (amount) => {
    return `$${parseFloat(amount).toFixed(2)}`
  }

  return (
    <div className="relative w-full overflow-auto">
      <table className="w-full caption-bottom text-sm">
        <thead className="[&_tr]:border-b">
          <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
            {headers.map((header) => (
              <th
                key={header.key}
                className="w-[100px] h-10 px-4 text-left align-middle font-bold text-muted-foreground"
              >
                {header.title}
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
              {headers.map((header) => (
                <td key={header.key} className="font-medium p-2 align-middle">
                  {header.key === "date"
                    ? formatDate(row[header.key])
                    : header.key === "total" || header.key === "price"
                      ? formatTotal(row[header.key])
                      : row[header.key]}
                </td>
              ))}
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
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
}

export default Table
