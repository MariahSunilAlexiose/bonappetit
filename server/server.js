const express = require("express")
const mysql = require("mysql")
const cors = require("cors")
const path = require("path")
const dotenv = require("dotenv")

dotenv.config()

const app = express()
app.use(express.static(path.join(__dirname, "public")))
app.use(cors())
app.use(express.json())

const port = process.env.DB_PORT
const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
}

const db = mysql.createConnection(dbConfig)

db.connect((error) => {
  if (error) {
    console.error("Error connecting to the database:", error)
    return
  }
  console.log("Connected to the database")
})

app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})

app.get("/", (req, res) => {
  res.send("Welcome to the BonAppetit API!")
})

// restaurants
app.get("/restaurants", (req, res) => {
  const sql = "SELECT * FROM restaurant"
  db.query(sql, (err, result) => {
    if (err) {
      console.error("Error executing query:", err)
      return res.status(500).json({ message: "Server error" })
    }
    res.json(result)
  })
})

app.get("/get_restaurant/:restaurantName", (req, res) => {
  const restaurantName = req.params.restaurantName
  const sql = "SELECT * FROM restaurant WHERE name = ?"
  db.query(sql, [restaurantName], (err, result) => {
    if (err) {
      console.error("Error executing query:", err)
      return res.status(500).json({ message: "Server error" })
    }
    res.json(result)
  })
})

// menu
app.get("/get_menu/:restaurantName", (req, res) => {
  const restaurantName = req.params.restaurantName
  const sql = `
    SELECT m.*
    FROM menuItem m
    JOIN restaurant r ON m.restaurantID = r.restaurantID
    WHERE r.name = ?`
  db.query(sql, [restaurantName], (err, result) => {
    if (err) {
      console.error("Error executing query:", err)
      return res.status(500).json({ message: "Server error" })
    }
    res.json(result)
  })
})

// customers
app.get("/customers", (req, res) => {
  const sql = "SELECT * FROM customer"
  db.query(sql, (err, result) => {
    if (err) {
      console.error("Error executing query:", err)
      return res.status(500).json({ message: "Server error" })
    }
    res.json(result)
  })
})

app.get("/get_customer/:name", (req, res) => {
  const name = req.params.name
  const sql = "SELECT * FROM customer WHERE name = ?"
  db.query(sql, [name], (err, result) => {
    if (err) {
      console.error("Error executing query:", err)
      return res.status(500).json({ message: "Server error" })
    }
    res.json(result)
  })
})

// customer orders
app.get("/customerorders/:custid", (req, res) => {
  const custid = req.params.custid
  const sql = `
    SELECT 
      co.customerorderID,
      r.name AS restaurantName,
      co.date,
      co.paymentStatus,
      co.deliveryStatus
  FROM 
      customerorder co
  JOIN 
      restaurant r ON co.restaurantID = r.restaurantID
  WHERE 
      co.customerID = ?;`
  db.query(sql, [custid], (err, result) => {
    if (err) {
      console.error("Error executing query:", err)
      return res.status(500).json({ message: "Server error" })
    }
    res.json(result)
  })
})

// customer order
app.get("/customerorder/:id", (req, res) => {
  const id = req.params.id
  const sql = `
  SELECT 
    co.customerorderID,
    c.name AS customerName,
    r.name AS restaurantName,
    co.date,
    co.paymentstatus,
    co.deliverystatus,
    e.name as employeeName
  FROM 
      customerorder co
  JOIN 
      customer c ON co.customerID = c.customerID
  JOIN 
      restaurant r ON co.restaurantID = r.restaurantID
  JOIN 
      employee e ON co.restaurantID = e.employeeID
  WHERE 
      co.customerorderID = ?;`
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error("Error executing query:", err)
      return res.status(500).json({ message: "Server error" })
    }
    res.json(result)
  })
})

// customer order item
app.get("/get_customerorderitems/:orderId", (req, res) => {
  const { orderId } = req.params
  const sql = `
    SELECT 
      m.name as menuitemName, 
      quantity 
    FROM 
      customerorderItem c 
    JOIN 
      menuitem m ON m.menuitemID = c.menuitemID 
    WHERE 
      c.customerorderID = ?`
  db.query(sql, [orderId], (err, result) => {
    if (err) {
      console.error("Error executing query:", err)
      return res.status(500).json({ message: "Server error" })
    }
    res.json(result)
  })
})

// employees
app.get("/employees", (req, res) => {
  const sql = "SELECT * FROM employeesview"
  db.query(sql, (err, result) => {
    if (err) {
      console.error("Error executing query:", err)
      return res.status(500).json({ message: "Server error" })
    }
    res.json(result)
  })
})

app.get("/get_employee/:employeeName", (req, res) => {
  const employeeName = req.params.employeeName
  const sql = `
  SELECT 
    e.employeeID,
    e.name,
    e.role,
    e.phone,
    e.address,
    r.name AS restaurantName,
    e.salary
  FROM 
    employee e
  JOIN
    restaurant r ON r.restaurantID = e.restaurantID
  WHERE 
    e.name = ?`
  db.query(sql, [employeeName], (err, result) => {
    if (err) {
      console.error("Error executing query:", err)
      return res.status(500).json({ message: "Server error" })
    }
    res.json(result)
  })
})

app.get("/get_employeeorders/:employeeID", (req, res) => {
  const { employeeID } = req.params
  const sql = `
    SELECT 
      co.customerorderID, 
      c.name AS customerName,
      r.name AS restaurantName,
      co.date,
      co.paymentStatus,
      co.deliveryStatus
    FROM 
      customerorder co
    JOIN 
      customer c ON c.customerID = co.customerID 
    JOIN 
      restaurant r ON r.restaurantID = co.restaurantID 
    WHERE 
      co.employeeID = ?`
  db.query(sql, [employeeID], (err, result) => {
    if (err) {
      console.error("Error executing query:", err)
      return res.status(500).json({ message: "Server error" })
    }
    res.json(result)
  })
})

// inventory
app.get("/inventory", (req, res) => {
  const sql = "SELECT * FROM inventoryview"
  db.query(sql, (err, result) => {
    if (err) {
      console.error("Error executing query:", err)
      return res.status(500).json({ message: "Server error" })
    }
    res.json(result)
  })
})

// supplier
app.get("/suppliers", (req, res) => {
  const sql = "SELECT * FROM supplier"
  db.query(sql, (err, result) => {
    if (err) {
      console.error("Error executing query:", err)
      return res.status(500).json({ message: "Server error" })
    }
    res.json(result)
  })
})
