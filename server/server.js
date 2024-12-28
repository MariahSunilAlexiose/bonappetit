const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const path = require("path");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
app.use(express.static(path.join(__dirname, "public")));
app.use(cors());
app.use(express.json());

const port = process.env.PORT;
const dbConfig = { 
  host: process.env.DB_HOST, 
  user: process.env.DB_USER, 
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE
};

const db = mysql.createConnection(dbConfig);

db.connect(error => {
    if (error) {
        console.error('Error connecting to the database:', error);
        return;
    }
    console.log('Connected to the database');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

app.get("/", (req, res) => { res.send("Welcome to the BonAppetit API!"); });

app.get("/total_sales", (req, res) => {
  const sql = `
  SELECT ROUND(SUM(c.quantity * m.price), 2) AS total_sales
  FROM customerOrderItem c
  JOIN menuItem m ON c.menuItemID = m.menuItemID;
  `;
  db.query(sql, (err, result) => {
    if (err) {
      console.error("Error executing query:", err);
      return res.status(500).json({ message: "Server error" });
    }
    res.json(result);
  });
});

app.get("/total_profit", (req, res) => {
  const sql = `
  SELECT ROUND(total_sales - (total_inventory_expenses + total_salary_expenses), 2) AS total_profit
  FROM (
      SELECT
          (SELECT SUM(oi.quantity * m.price)
          FROM customerOrderItem oi
          JOIN menuItem m ON oi.menuItemID = m.menuItemID) AS total_sales,
          (SELECT SUM(ioi.quantity * ioi.unitPrice)
          FROM inventoryorderItem ioi
          JOIN inventoryorder io ON ioi.inventoryOrderID = io.inventoryOrderID) AS total_inventory_expenses,
          (SELECT SUM(salary)
          FROM employee) AS total_salary_expenses
  ) AS derived;
  `;
  db.query(sql, (err, result) => {
    if (err) {
      console.error("Error executing query:", err);
      return res.status(500).json({ message: "Server error" });
    }
    res.json(result);
  });
})

app.get("/avg_rating", (req, res) => {
  const sql = `
  SELECT ROUND(AVG(rating), 2) AS average_rating
  FROM restaurant;
  `;
  db.query(sql, (err, result) => {
    if (err) {
      console.error("Error executing query:", err);
      return res.status(500).json({ message: "Server error" });
    }
    res.json(result);
  });
})

app.get("/last_transactions", (req, res) => {
  const sql = "SELECT * from inventoryordersview order by date desc limit 5";
  db.query(sql, (err, result) => {
    if (err) {
      console.error("Error executing query:", err);
      return res.status(500).json({ message: "Server error" });
    }
    res.json(result);
  });
});

app.get("/customers", (req, res) => {
  const sql = "SELECT * FROM customer";
  db.query(sql, (err, result) => {
    if (err) {
      console.error("Error executing query:", err);
      return res.status(500).json({ message: "Server error" });
    }
    res.json(result);
  });
});

app.get("/get_customer/:id", (req, res) => {
  const { id } = req.params;
  const sql = "SELECT * FROM customer WHERE customerID = ?";
  
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error("Error executing query:", err);
      return res.status(500).json({ message: "Server error" });
    }
    if (result.length === 0) {
      return res.status(404).json({ message: "Customer not found" });
    }
    res.json(result[0]);
  });
});

app.post("/add_customer", (req, res) => {
  const { name, email, phone, address } = req.body;
  const sql = "INSERT INTO customer (name, email, phone, address) VALUES (?, ?, ?, ?)";
  
  db.query(sql, [name, email, phone, address], (err, result) => {
    if (err) {
      console.error("Error executing query:", err);
      return res.status(500).json({ message: "Server error" });
    }
    res.json({ message: "Customer added successfully" });
  });
});

app.delete("/delete_customer/:id", (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM customer WHERE customerID = ?";
  
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error("Error executing query:", err);
      return res.status(500).json({ message: "Server error" });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Customer not found" });
    }
    res.json({ message: "Customer deleted successfully" });
  });
});

app.put("/edit_customer/:id", (req, res) => {
  const { id } = req.params;
  const { name, email, phone, address } = req.body;
  const sql = "UPDATE customer SET name = ?, email = ?, phone = ?, address = ? WHERE customerID = ?";
  
  db.query(sql, [name, email, phone, address, id], (err, result) => {
    if (err) {
      console.error("Error executing query:", err);
      return res.status(500).json({ message: "Server error" });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Customer not found" });
    }
    res.json({ message: "Customer updated successfully" });
  });
});
