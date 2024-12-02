import React from "react"

import { Table } from "../components"

const data = [
  {
    trackingID: "INV001",
    status: "Paid",
    amt: "$250.00",
    paymentMethod: "Credit Card",
  },
  {
    trackingID: "INV002",
    status: "Pending",
    amt: "$150.00",
    paymentMethod: "PayPal",
  },
  {
    trackingID: "INV003",
    status: "Unpaid",
    amt: "$350.00",
    paymentMethod: "Bank Transfer",
  },
  {
    trackingID: "INV004",
    status: "Paid",
    amt: "$450.00",
    paymentMethod: "Credit Card",
  },
  {
    trackingID: "INV005",
    status: "Paid",
    amt: "$550.00",
    paymentMethod: "PayPal",
  },
  {
    trackingID: "INV006",
    status: "Pending",
    amt: "$200.00",
    paymentMethod: "Bank Transfer",
  },
  {
    trackingID: "INV007",
    status: "Unpaid",
    amt: "$300.00",
    paymentMethod: "Credit Card",
  },
]

const headers = [
  { key: "date", label: "Date" },
  { key: "trackingID", label: "Tracking ID" },
  { key: "orderID", label: "Order ID" },
  { key: "amt", label: "Amount" },
  { key: "paymentMethod", label: "Payment Method" },
  { key: "status", label: "Status" },
]

const Employees = () => {
  return (
    <div>
      <h1>Employees</h1>
      <Table headers={headers} data={data} />
    </div>
  )
}

export default Employees
