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
  const sql = `
    SELECT 
      *
    FROM
      restaurant`
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
  const sql = `
    SELECT
      *
    FROM
      restaurant
    WHERE
      name = ?`
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
  const deleteMenuItemSql = `
    DELETE FROM 
      menuitem
    WHERE
      restaurantID = ?`
  const deleteEmployeeSql = `
    DELETE FROM
      employee
    WHERE
      restaurantID = ?`
  const deleteRestaurantSql = `
    DELETE FROM
      restaurant
    WHERE
      restaurantID = ?`
  const deleteInventorySql = `
    DELETE FROM
      inventory
    WHERE
      inventoryID = ?`
  const deleteInventoryOrderItemSql = `
    DELETE FROM
      inventoryorderitem
    WHERE
      inventoryID = ?`
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

app.post("/add_restaurant", (req, res) => {
  const sql =
    "INSERT INTO restaurant (restaurantID, name, address, phone, rating) VALUES (?, ?, ?, ?, ?)"
  const values = [
    req.body.restaurantID,
    req.body.name,
    req.body.address,
    req.body.phone,
    req.body.rating,
  ]
  db.query(sql, values, (err) => {
    if (err) {
      console.error("Error executing query:", err)
      return res.status(500).json({ message: "Server error" })
    }
    res.json({ success: "Restaurant added successfully!" })
  })
})

// menu
app.get("/get_menu/:restaurantName", (req, res) => {
  const { restaurantName } = req.params
  const sql = `
    SELECT 
      *
    FROM 
      menuitem
    WHERE 
      restaurantID = 
        (SELECT 
            restaurantID 
          FROM
            restaurant 
          WHERE 
            name = ?)`
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
  const sql = `
    DELETE FROM
      menuitem
    WHERE
      menuitemID = ?`
  db.query(sql, [id], (err) => {
    if (err) {
      console.error("Error executing query:", err)
      return res.status(500).json({ message: "Server error" })
    }
    res.json({ success: "Menu item deleted successfully" })
  })
})

app.get("/menuitems", (req, res) => {
  const sql = "SELECT * FROM menuitem"
  db.query(sql, (err, result) => {
    if (err) {
      console.error("Error executing query:", err)
      return res.status(500).json({ message: "Server error" })
    }
    res.json(result)
  })
})

app.post("/add_menuitem", (req, res) => {
  const sql =
    "INSERT INTO menuitem (menuitemID, name, price, description, restaurantID) VALUES (?, ?, ?, ?, ?)"
  const values = [
    req.body.menuitemID,
    req.body.name,
    req.body.price,
    req.body.description,
    req.body.restaurantID,
  ]
  db.query(sql, values, (err) => {
    if (err) {
      console.error("Error executing query:", err)
      return res.status(500).json({ message: "Server error" })
    }
    res.json({ success: "Menu item added successfully!" })
  })
})

// customers
app.get("/customers", (req, res) => {
  const sql = `
    SELECT 
      *
    FROM
      customer`
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
  const sql = `
    SELECT 
      *
    FROM
      customer
    WHERE
      name = ?`
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
  const deleteCustomerOrderItemSql = `
    DELETE FROM
      customerorderitem
    WHERE
      customerorderID IN (
        SELECT 
          customerorderID
        FROM
          customerorder
        WHERE
          customerID = ?)`
  const deleteCustomerOrderSql = `
    DELETE FROM
      customerorder
    WHERE
      customerID = ?`
  const deleteCustomerSql = `
    DELETE FROM
      customer
    WHERE
      customerID = ?`
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

app.post("/add_customer", (req, res) => {
  const sql =
    "INSERT INTO customer (customerID, name, email, phone, address) VALUES (?, ?, ?, ?, ?)"
  const values = [
    req.body.customerID,
    req.body.name,
    req.body.email,
    req.body.phone,
    req.body.address,
  ]
  db.query(sql, values, (err) => {
    if (err) {
      console.error("Error executing query:", err)
      return res.status(500).json({ message: "Server error" })
    }
    res.json({ success: "Customer added successfully!" })
  })
})

// customer orders
app.get("/customerorders/:custid", (req, res) => {
  const { custid } = req.params
  const sql = `
    SELECT
      co.*,
      (SELECT
          r.name
        FROM
          restaurant r
        WHERE
          r.restaurantID = co.restaurantID
      ) AS restaurantName,
      (SELECT
          e.name
        FROM
          employee e
        WHERE
          e.employeeID = co.employeeID
      ) AS employeeName
    FROM
      customerorder co
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
      co.*,
      (SELECT
        c.name
      FROM
        customer c
      WHERE
        c.customerID = co.customerID
      ) AS customerName,
      (SELECT
        r.name
      FROM
        restaurant r
      WHERE
        r.restaurantID = co.restaurantID
      ) AS restaurantName,
      (SELECT
        e.name
      FROM
        employee e
      WHERE
        e.employeeID = co.employeeID
      ) AS employeeName
    FROM
      customerorder co
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
  const deleteCustomerOrderItemSql = `
    DELETE FROM
      customerorderitem
    WHERE
      customerorderID = ?`
  const deleteCustomerOrderSql = `
    DELETE FROM
      customerorder
    WHERE
      customerorderID = ?`
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
      c.*,
      (SELECT
        m.name
      FROM
        menuitem m
      WHERE
        m.menuitemID = c.menuitemID
      ) AS menuitemName
    FROM 
      customerorderitem c
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
  const sql = `
    DELETE FROM
      customerorderitem
    WHERE
      customerorderID = ?
        AND
      menuitemID = ?`
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
  const sql = `
    SELECT 
      *
    FROM
      employeesview`
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
      e.*,
      (SELECT
        r.name
        FROM
          restaurant r
        WHERE
          r.restaurantID = e.restaurantID
      ) AS restaurantName
    FROM 
      employee e
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
      co.*,
      (SELECT
          c.name
        FROM
          customer c
        WHERE
          c.customerID = co.customerID
      ) AS customerName,
      (SELECT
          r.name
        FROM
          restaurant r
        WHERE
          r.restaurantID = co.restaurantID
      ) AS restaurantName
    FROM 
      customerorder co
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
  const deleteInventoryOrderSql = `
    DELETE FROM
      inventoryorder
    WHERE
      employeeID = ?`
  const deleteCustomerOrderItemSql = `
    DELETE FROM 
      customerorderitem 
    WHERE
      customerorderID IN 
        (SELECT
            customerorderID
          FROM
            customerorder
          WHERE
            customerID = ?)`
  const deleteCustomerOrderSql = `
    DELETE FROM
      customerorder
    WHERE
      customerID = ?`
  const deleteEmployeeSql = `
    DELETE FROM
      employee
    WHERE
      employeeID = ?`

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
      i.*,
      (SELECT
          r.name
        FROM
          restaurant r
        WHERE
          r.restaurantID = i.restaurantID
      ) AS restaurantName
    FROM 
      inventory i;`
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
      i.*,
      (SELECT
          r.name
        FROM
          restaurant r
        WHERE
          r.restaurantID = i.restaurantID
      ) AS restaurantName
    FROM 
      inventory i
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
  const deleteInventoryOrderItemSql = `
    DELETE FROM
      inventoryorderitem
    WHERE
      inventoryID = ?`
  const deleteInventorySql = `
    DELETE FROM
      inventory
    WHERE
      inventoryID = ?`
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
      *,
      (SELECT
          r.name
        FROM
          restaurant r
        WHERE
          r.restaurantID = io.restaurantID
      ) AS restaurantName,
      (SELECT
          s.name
        FROM
          supplier s
        WHERE
          s.supplierID = io.supplierID 
      ) AS supplierName,
      (SELECT
          e.name
        FROM
          employee e
        WHERE
          e.employeeID = io.employeeID
      ) AS employeeName
    FROM 
      inventoryorderitem ioi
    JOIN 
      inventoryorder io ON ioi.inventoryorderID = io.inventoryorderID
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
      *,
      (SELECT
          r.name
        FROM
          restaurant r
        WHERE
          r.restaurantID = io.restaurantID
      ) AS restaurantName,
      (SELECT
          s.name
        FROM
          supplier s
        WHERE
          s.supplierID = io.supplierID
      ) AS supplierName,
      (SELECT
          e.name
        FROM
          employee e
        WHERE
          e.employeeID = io.employeeID
      ) AS employeeName
    FROM
      inventoryorder io
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
      *,
      (SELECT
          r.name
        FROM
          restaurant r
        WHERE
          r.restaurantID = io.restaurantID
      ) AS restaurantName,
      (SELECT
          s.name
        FROM
          supplier s
        WHERE
          s.supplierID = io.supplierID
      ) AS supplierName,
      (SELECT
          e.name
        FROM
          employee e
        WHERE
          e.employeeID = io.employeeID
      ) AS employeeName
    FROM 
      inventoryorder io
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
      *, 
      (SELECT
          i.name
        FROM
          inventory i
        WHERE
          i.inventoryID = ioi.inventoryID
      ) AS inventoryName
    FROM 
      inventoryorderitem ioi
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
  const deleteInventoryOrderItemSql = `
    DELETE FROM
      inventoryorderitem
    WHERE
      inventoryorderID = ?`
  const deleteInventoryOrderSql = `
    DELETE FROM
      inventoryorder
    WHERE
      inventoryorderID = ?`
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
  const sql = `
    DELETE FROM
      inventoryorderitem
    WHERE
      inventoryorderID = ?
        AND
      inventoryID = ?`
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
  const sql = `
    SELECT 
      *
    FROM
      supplier`
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
  const sql = `
    SELECT 
      *
    FROM
      supplier
    WHERE
      name = ?`
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
  const deleteInventoryOrderSql = `
    DELETE FROM
      inventoryorder
    WHERE
      supplierID = ?`
  const deleteSupplierSql = `
    DELETE FROM
      supplier
    WHERE
      supplierID = ?`
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
