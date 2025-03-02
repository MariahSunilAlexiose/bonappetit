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

export const paymentstatus = ["Pending", "Completed"]

export const deliverystatus = ["Not Delivered", "In Transit", "Delivered"]

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
  supplierorderitem: ["inventoryorderID", "inventoryID"],
  supplierorder: "inventoryorderID",
}

export const formatDate = (dateString) => {
  const options = { day: "numeric", month: "short", year: "numeric" }
  const formattedDate = new Intl.DateTimeFormat("en-US", options).format(
    new Date(dateString)
  )
  const [month, day, year] = formattedDate.replace(",", "").split(" ")
  return `${day} ${month} ${year}`
}

export const displayNames = {
  inventoryorder: "Inventory Order",
  inventoryorderitem: "Inventory Order Item",
  customerorder: "Customer Order",
  customerorderitem: "Customer Order Item",
  employeeorder: "Employee Order",
  supplierorder: "Supplier Order",
  supplierorderitem: "Supplier Order Item",
  menuitem: "Menu Item",
}

export const getNameByID = (id, list, tableName) => {
  const idField = idMap[tableName]
  if (!idField) return ""

  const item = list.find((i) => i[idField] === id)
  return item ? item.name : ""
}

export const filterMapping = {
  customerorderitem: (item) => ({
    menuitemName: item.menuitemName,
    quantity: item.quantity,
  }),
  inventoryorderitem: (item) => ({
    inventoryorderID: item.inventoryorderID,
    date: item.date,
    restaurantName: item.restaurantName,
    supplierName: item.supplierName,
    employeeName: item.employeeName,
    unitPrice: item.unitPrice,
    quantity: item.quantity,
    paymentStatus: item.paymentStatus,
    deliveryStatus: item.deliveryStatus,
  }),
  supplierorderitem: (item) => ({
    inventoryName: item.inventoryName,
    quantity: item.quantity,
    unitPrice: item.unitPrice,
  }),
  customerorder: (item) => ({
    customerorderID: item.customerorderID,
    date: item.date,
    restaurantName: item.restaurantName,
    employeeName: item.employeeName,
    paymentStatus: item.paymentStatus,
    deliveryStatus: item.deliveryStatus,
  }),
  employeeorder: (item) => ({
    customerorderID: item.customerorderID,
    date: item.date,
    customerName: item.customerName,
    restaurantName: item.restaurantName,
    paymentStatus: item.paymentStatus,
    deliveryStatus: item.deliveryStatus,
  }),
  inventory: (item) => ({
    inventoryID: item.inventoryID,
    name: item.name,
    quantity: item.quantity,
    restaurantName: item.restaurantName,
  }),
  supplierorder: (item) => ({
    inventoryorderID: item.inventoryorderID,
    date: item.date,
    restaurantName: item.restaurantName,
    employeeName: item.employeeName,
    paymentStatus: item.paymentStatus,
    deliveryStatus: item.deliveryStatus,
  }),
  menuitem: (item) => ({
    menuitemID: item.menuitemID,
    name: item.name,
    price: item.price,
    description: item.description,
  }),
  employee: (item) => ({
    employeeID: item.employeeID,
    name: item.name,
    restaurantName: item.restaurantName,
    role: item.role,
    phone: item.phone,
    address: item.address,
    salary: item.salary,
  }),
}

export const AddFormApiMapping = {
  employee: ["/restaurants"],
  inventory: ["/restaurants"],
  inventoryorder: ["/restaurants", "/suppliers", "/employees", "/inventory"],
  customerorder: ["/restaurants", "/employees", "/customers"],
  employeeorder: ["/restaurants", "/employees", "/customers"],
  supplierorder: [
    "/restaurants",
    "/employees",
    "/customers",
    "/suppliers",
    "/inventory",
  ],
  supplierorderitem: ["/inventory"],
  menuitem: ["/restaurants"],
}

export const createStateSetters = (
  setRestaurants,
  setInventory,
  setSuppliers,
  setEmployees,
  setCustomers
) => ({
  "/restaurants": setRestaurants,
  "/suppliers": setSuppliers,
  "/employees": setEmployees,
  "/inventory": setInventory,
  "/customers": setCustomers,
})
