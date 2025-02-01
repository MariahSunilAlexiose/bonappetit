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
