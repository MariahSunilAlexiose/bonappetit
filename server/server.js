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
  const { restaurantName } = req.params
  const sql = "SELECT * FROM restaurant WHERE name = ?"
  db.query(sql, [restaurantName], (err, result) => {
    if (err) {
      console.error("Error executing query:", err)
      return res.status(500).json({ message: "Server error" })
    }
    res.json(result)
  })
})

app.delete("/delete_restaurant/:id", (req, res) => {
  const { id } = req.params
  const deleteMenuItemSql = "DELETE FROM menuitem WHERE restaurantID = ?"
  const deleteEmployeeSql = "DELETE FROM employee WHERE restaurantID = ?"
  const deleteRestaurantSql = "DELETE FROM restaurant WHERE restaurantID = ?"
  const deleteInventorySql = "DELETE FROM inventory WHERE inventoryID = ?"
  const deleteInventoryOrderItemSql =
    "DELETE FROM inventoryorderitem WHERE inventoryID = ?"

  db.query(deleteInventoryOrderItemSql, [id], (err) => {
    if (err) {
      console.error("Error executing query:", err)
      return res.status(500).json({ message: "Server error" })
    }

    db.query(deleteInventorySql, [id], (err) => {
      if (err) {
        console.error("Error executing query:", err)
        return res.status(500).json({ message: "Server error" })
      }

      db.query(deleteEmployeeSql, [id], (err) => {
        if (err) {
          console.error("Error executing query:", err)
          return res.status(500).json({ message: "Server error" })
        }

        db.query(deleteMenuItemSql, [id], (err) => {
          if (err) {
            console.error("Error executing query:", err)
            return res.status(500).json({ message: "Server error" })
          }

          db.query(deleteRestaurantSql, [id], (err) => {
            if (err) {
              console.error("Error executing query:", err)
              return res.status(500).json({ message: "Server error" })
            }

            res.json({ success: "Restaurant deleted successfully" })
          })
        })
      })
    })
  })
})

// menu
app.get("/get_menu/:restaurantName", (req, res) => {
  const { restaurantName } = req.params
  const sql = `
    SELECT 
      m.*
    FROM 
      menuitem m
    JOIN 
      restaurant r ON m.restaurantID = r.restaurantID
    WHERE 
      r.name = ?`
  db.query(sql, [restaurantName], (err, result) => {
    if (err) {
      console.error("Error executing query:", err)
      return res.status(500).json({ message: "Server error" })
    }
    res.json(result)
  })
})

app.delete("/delete_menuitem/:id", (req, res) => {
  const { id } = req.params
  const sql = "DELETE FROM menuitem WHERE menuitemID = ?"
  db.query(sql, [id], (err) => {
    if (err) {
      console.error("Error executing query:", err)
      return res.status(500).json({ message: "Server error" })
    }
    res.json({ success: "Menu item deleted successfully" })
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
  const { name } = req.params
  const sql = "SELECT * FROM customer WHERE name = ?"
  db.query(sql, [name], (err, result) => {
    if (err) {
      console.error("Error executing query:", err)
      return res.status(500).json({ message: "Server error" })
    }
    res.json(result)
  })
})

app.delete("/delete_customer/:id", (req, res) => {
  const { id } = req.params
  const deleteCustomerOrderItemSql =
    "DELETE FROM customerorderitem WHERE customerorderID IN (SELECT customerorderID FROM customerorder WHERE customerID = ?)"
  const deleteCustomerOrderSql =
    "DELETE FROM customerorder WHERE customerID = ?"
  const deleteCustomerSql = "DELETE FROM customer WHERE customerID = ?"

  db.query(deleteCustomerOrderItemSql, [id], (err) => {
    if (err) {
      console.error("Error executing query:", err)
      return res.status(500).json({ message: "Server error" })
    }

    db.query(deleteCustomerOrderSql, [id], (err) => {
      if (err) {
        console.error("Error executing query:", err)
        return res.status(500).json({ message: "Server error" })
      }

      db.query(deleteCustomerSql, [id], (err) => {
        if (err) {
          console.error("Error executing query:", err)
          return res.status(500).json({ message: "Server error" })
        }

        res.json({ success: "Customer deleted successfully" })
      })
    })
  })
})

// customer orders
app.get("/customerorders/:custid", (req, res) => {
  const { custid } = req.params
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
  const { id } = req.params
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

app.delete("/delete_customerorder/:id", (req, res) => {
  const { id } = req.params
  const deleteCustomerOrderItemSql =
    "DELETE FROM customerorderitem WHERE customerorderID = ?"
  const deleteCustomerOrderSql =
    "DELETE FROM customerorder WHERE customerorderID = ?"

  db.query(deleteCustomerOrderItemSql, [id], (err) => {
    if (err) {
      console.error("Error executing query:", err)
      return res.status(500).json({ message: "Server error" })
    }

    db.query(deleteCustomerOrderSql, [id], (err) => {
      if (err) {
        console.error("Error executing query:", err)
        return res.status(500).json({ message: "Server error" })
      }

      res.json({ success: "Customer order deleted successfully" })
    })
  })
})

// customer order item
app.get("/get_customerorderitems/:orderId", (req, res) => {
  const { orderId } = req.params
  const sql = `
    SELECT
      c.customerorderID,
      c.menuitemID,
      m.name as menuitemName, 
      c.quantity
    FROM 
      customerorderitem c 
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

app.delete("/delete_customerorderitem/:orderId/:itemId", (req, res) => {
  const { orderId, itemId } = req.params
  const sql =
    "DELETE FROM customerorderitem WHERE customerorderID = ? AND menuitemID = ?"
  db.query(sql, [orderId, itemId], (err) => {
    if (err) {
      console.error("Error executing query:", err)
      return res.status(500).json({ message: "Server error" })
    }
    res.json({ success: "Customer order item deleted successfully!" })
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
  const { employeeName } = req.params
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

app.delete("/delete_employee/:id", (req, res) => {
  const { id } = req.params
  const deleteInventoryOrderSql =
    "DELETE FROM inventoryorder WHERE employeeID = ?"
  const deleteCustomerOrderItemSql =
    "DELETE FROM customerorderitem WHERE customerorderID IN (SELECT customerorderID FROM customerorder WHERE customerID = ?)"
  const deleteCustomerOrderSql =
    "DELETE FROM customerorder WHERE customerID = ?"
  const deleteEmployeeSql = "DELETE FROM employee WHERE employeeID = ?"

  db.query(deleteInventoryOrderSql, [id], (err) => {
    if (err) {
      console.error("Error executing query:", err)
      return res.status(500).json({ message: "Server error" })
    }

    db.query(deleteCustomerOrderItemSql, [id], (err) => {
      if (err) {
        console.error("Error executing query:", err)
        return res.status(500).json({ message: "Server error" })
      }

      db.query(deleteCustomerOrderSql, [id], (err) => {
        if (err) {
          console.error("Error executing query:", err)
          return res.status(500).json({ message: "Server error" })
        }

        db.query(deleteEmployeeSql, [id], (err) => {
          if (err) {
            console.error("Error executing query:", err)
            return res.status(500).json({ message: "Server error" })
          }

          res.json({ success: "Employee deleted successfully" })
        })
      })
    })
  })
})

// inventory
app.get("/inventory", (req, res) => {
  const sql = `
    SELECT 
      i.inventoryID,
      i.name,
      i.quantity,
      r.name AS restaurantName
    FROM 
      inventory i
    JOIN 
      restaurant r ON i.restaurantID = r.restaurantID;`
  db.query(sql, (err, result) => {
    if (err) {
      console.error("Error executing query:", err)
      return res.status(500).json({ message: "Server error" })
    }
    res.json(result)
  })
})

app.get("/get_inventoryItem/:inventoryName", (req, res) => {
  const { inventoryName } = req.params
  const sql = `
    SELECT 
      i.inventoryID,
      i.quantity,
      r.name AS restaurantName
    FROM 
      inventory i
    JOIN
      restaurant r ON r.restaurantID = i.restaurantID
    WHERE 
      i.name = ?`
  db.query(sql, [inventoryName], (err, result) => {
    if (err) {
      console.error("Error executing query:", err)
      return res.status(500).json({ message: "Server error" })
    }
    res.json(result)
  })
})

app.delete("/delete_inventory/:id", (req, res) => {
  const { id } = req.params
  const deleteInventoryOrderItemSql =
    "DELETE FROM inventoryorderitem WHERE inventoryID = ?"
  const deleteInventorySql = "DELETE FROM inventory WHERE inventoryID = ?"

  db.query(deleteInventoryOrderItemSql, [id], (err) => {
    if (err) {
      console.error("Error executing query:", err)
      return res.status(500).json({ message: "Server error" })
    }
    db.query(deleteInventorySql, [id], (err) => {
      if (err) {
        console.error("Error executing query:", err)
        return res.status(500).json({ message: "Server error" })
      }

      res.json({ success: "Inventory deleted successfully" })
    })
  })
})

// inventory orders
app.get("/get_inventoryorders/:inventoryID", (req, res) => {
  const { inventoryID } = req.params
  const sql = `
    SELECT 
      io.inventoryorderID,
      ioi.inventoryID,
      io.date,
      r.name AS restaurantName,
      s.name AS supplierName, 
      ioi.unitPrice,
      ioi.quantity,
      e.name AS employeeName,
      io.paymentStatus,
      io.deliveryStatus
    FROM 
      inventoryorderitem ioi
    JOIN 
      inventoryorder io ON ioi.inventoryorderID = io.inventoryorderID
    JOIN
      restaurant r ON r.restaurantID = io.restaurantID
    JOIN 
      employee e ON e.employeeID = io.employeeID 
    JOIN 
      supplier s ON s.supplierID = io.supplierID 
    WHERE 
      ioi.inventoryID = ?`
  db.query(sql, [inventoryID], (err, result) => {
    if (err) {
      console.error("Error executing query:", err)
      return res.status(500).json({ message: "Server error" })
    }
    res.json(result)
  })
})

app.get("/get_inventoryorders_by_supplier/:supplierID", (req, res) => {
  const { supplierID } = req.params
  const sql = `
    SELECT
      io.inventoryorderID,
      io.date,
      r.name AS restaurantName,
      e.name AS employeeName,
      s.name AS supplierName,
      io.paymentStatus,
      io.deliveryStatus
    FROM
      inventoryorder io
    JOIN 
      restaurant r ON io.restaurantID = r.restaurantID
    JOIN 
      employee e ON io.employeeID = e.employeeID
    JOIN 
      supplier s ON io.supplierID = s.supplierID
    WHERE 
      io.supplierID = ?`
  db.query(sql, [supplierID], (err, result) => {
    if (err) {
      console.error("Error executing query:", err)
      return res.status(500).json({ message: "Server error" })
    }
    res.json(result)
  })
})

app.get("/get_inventoryorder/:orderID", (req, res) => {
  const { orderID } = req.params
  const sql = `
    SELECT 
      io.date,
      s.name AS supplierName,
      e.name AS employeeName,
      r.name AS restaurantName,
      io.paymentStatus,
      io.deliveryStatus
    FROM 
      inventoryorder io
    JOIN
      supplier s ON io.supplierID = s.supplierID
    JOIN
      employee e ON io.supplierID = e.employeeID
    JOIN
      restaurant r ON io.restaurantID = r.restaurantID
    WHERE 
      io.inventoryorderID = ?`
  db.query(sql, [orderID], (err, result) => {
    if (err) {
      console.error("Error executing query:", err)
      return res.status(500).json({ message: "Server error" })
    }
    res.json(result)
  })
})

app.get("/get_inventoryorderitems/:orderId", (req, res) => {
  const { orderId } = req.params
  const sql = `
    SELECT 
      ioi.*, 
      i.name AS inventoryName
    FROM 
      inventoryorderitem ioi 
    JOIN 
      inventory i ON ioi.inventoryID = i.inventoryID
    WHERE 
      ioi.inventoryorderID = ?`
  db.query(sql, [orderId], (err, result) => {
    if (err) {
      console.error("Error executing query:", err)
      return res.status(500).json({ message: "Server error" })
    }
    res.json(result)
  })
})

app.delete("/delete_inventoryorder/:id", (req, res) => {
  const { id } = req.params
  const deleteInventoryOrderItemSql =
    "DELETE FROM inventoryorderitem WHERE inventoryorderID = ?"
  const deleteInventoryOrderSql =
    "DELETE FROM inventoryorder WHERE inventoryorderID = ?"

  db.query(deleteInventoryOrderItemSql, [id], (err) => {
    if (err) {
      console.error("Error executing query:", err)
      return res.status(500).json({ message: "Server error" })
    }
    db.query(deleteInventoryOrderSql, [id], (err) => {
      if (err) {
        console.error("Error executing query:", err)
        return res.status(500).json({ message: "Server error" })
      }

      res.json({ success: "Inventory deleted successfully" })
    })
  })
})

app.delete("/delete_inventoryorderitem/:orderId/:itemId", (req, res) => {
  const { orderId, itemId } = req.params
  const sql =
    "DELETE FROM inventoryorderitem WHERE inventoryorderID = ? AND inventoryID = ?"
  db.query(sql, [orderId, itemId], (err) => {
    if (err) {
      console.error("Error executing query:", err)
      return res.status(500).json({ message: "Server error" })
    }
    res.json({ success: "Inventory order deleted successfully" })
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

app.get("/get_supplier/:supplierName", (req, res) => {
  const { supplierName } = req.params
  const sql = "SELECT * FROM supplier WHERE name = ?"
  db.query(sql, [supplierName], (err, result) => {
    if (err) {
      console.error("Error executing query:", err)
      return res.status(500).json({ message: "Server error" })
    }
    res.json(result)
  })
})

app.delete("/delete_supplier/:id", (req, res) => {
  const { id } = req.params
  const deleteInventoryOrderSql =
    "DELETE FROM inventoryorder WHERE supplierID = ?"
  const deleteSupplierSql = "DELETE FROM supplier WHERE supplierID = ?"

  db.query(deleteInventoryOrderSql, [id], (err) => {
    if (err) {
      console.error("Error executing query:", err)
      return res.status(500).json({ message: "Server error" })
    }

    db.query(deleteSupplierSql, [id], (err) => {
      if (err) {
        console.error("Error executing query:", err)
        return res.status(500).json({ message: "Server error" })
      }
      res.json({ success: "Supplier deleted successfully" })
    })
  })
})
