export const keyMapping = {
  restaurantID: "Restaurant ID",
  restaurantName: "Restaurant",
  name: "Name",
  date: "Date",
  role: "Role",
  phone: "Phone",
  email: "Email",
  price: "Price",
  rating: "Rating",
  salary: "Salary",
  address: "Address",
  quantity: "Quantity",
  unitPrice: "Unit Price",
  description: "Description",
  paymentStatus: "Payment Status",
  deliveryStatus: "Delivery Status",
  contactPerson: "Contact Person",
  customerID: "Customer ID",
  customerName: "Customer Name",
  customerorderID: "Customer Order ID",
  employeeID: "Employee ID",
  employeeName: "Employee",
  inventoryID: "Inventory ID",
  inventoryorderID: "Inventory Order ID",
  inventoryName: "Inventory Name",
  supplierID: "Supplier ID",
  supplierName: "Supplier",
  menuitemID: "Menu Item ID",
  menuitemName: "Menu Item",
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

export const idMap = {
  supplier: "supplierID",
  customer: "customerID",
  employee: "employeeID",
  inventory: "inventoryID",
  menuitem: "menuitemID",
  customerorder: "customerorderID",
  restaurant: "restaurantID",
  customerorderitem: ["customerorderID", "menuitemID"],
  employeeorder: "customerorderID",
  inventoryorderitem: ["inventoryorderID", "inventoryID"],
}

export const formatDate = (dateString) => {
  const options = { day: "numeric", month: "short", year: "numeric" }
  const formattedDate = new Intl.DateTimeFormat("en-US", options).format(
    new Date(dateString)
  )
  const [month, day, year] = formattedDate.replace(",", "").split(" ")
  return `${day} ${month} ${year}`
}
