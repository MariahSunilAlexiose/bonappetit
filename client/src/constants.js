export const keyMapping = {
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
  contactPerson: "Contact Person",
  restaurantName: "Restaurant",
  supplierName: "Supplier",
  menuitemID: "Menu Item ID",
  price: "Price",
  description: "Description",
  inventoryOrderID: "Inventory Order ID",
  date: "Date",
  paymentStatus: "Payment Status",
  deliveryStatus: "Delivery Status",
  employeeName: "Employee",
  customerOrderID: "Customer Order ID",
  menuItemName: "Menu Item",
}

export const paymentstatus = {
  pending: "Pending",
  completed: "Completed",
}

export const deliverystatus = {
  notdelivered: "Not Delivered",
  intransit: "In Transit",
  delivered: "Delivered",
}

export const formatDate = (dateString) => {
  const options = { day: "numeric", month: "short", year: "numeric" }
  const formattedDate = new Intl.DateTimeFormat("en-US", options).format(
    new Date(dateString)
  )
  const [month, day, year] = formattedDate.replace(",", "").split(" ")
  return `${day} ${month} ${year}`
}
