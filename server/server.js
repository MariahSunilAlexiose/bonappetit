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
  db.query("SELECT * FROM restaurant", (err, result) => {
    if (err) {
      console.error("Error executing query:", err)
      return res.status(500).json({ message: "Server error" })
    }
    res.json(result)
  })
})

app.get("/get_restaurant_by_name/:restaurantName", (req, res) => {
  db.query(
    "SELECT * FROM restaurant WHERE name = ?",
    [req.params.restaurantName],
    (err, result) => {
      if (err) {
        console.error("Error executing query:", err)
        return res.status(500).json({ message: "Server error" })
      }
      res.json(result)
    }
  )
})

app.get("/get_restaurant_by_id/:restaurantID", (req, res) => {
  db.query(
    "SELECT * FROM restaurant WHERE restaurantID = ?",
    [req.params.restaurantID],
    (err, result) => {
      if (err) {
        console.error("Error executing query:", err)
        return res.status(500).json({ message: "Server error" })
      }
      res.json(result)
    }
  )
})

app.delete("/delete_restaurant/:id", (req, res) => {
  const { id } = req.params
  db.query(
    "DELETE FROM inventoryorderitem WHERE inventoryID = ?",
    [id],
    (err) => {
      if (err) {
        console.error("Error executing query:", err)
        return res.status(500).json({ message: "Server error" })
      }

      db.query(
        "DELETE FROM inventoryorder WHERE inventoryID = ?",
        [id],
        (err) => {
          if (err) {
            console.error("Error executing query:", err)
            return res.status(500).json({ message: "Server error" })
          }

          db.query(
            "DELETE FROM employee WHERE restaurantID = ?",
            [id],
            (err) => {
              if (err) {
                console.error("Error executing query:", err)
                return res.status(500).json({ message: "Server error" })
              }

              db.query(
                "DELETE FROM menuitem WHERE restaurantID = ?",
                [id],
                (err) => {
                  if (err) {
                    console.error("Error executing query:", err)
                    return res.status(500).json({ message: "Server error" })
                  }

                  db.query(
                    "DELETE FROM restaurant WHERE restaurantID = ?",
                    [id],
                    (err) => {
                      if (err) {
                        console.error("Error executing query:", err)
                        return res.status(500).json({ message: "Server error" })
                      }

                      res.json({ success: "Restaurant deleted successfully" })
                    }
                  )
                }
              )
            }
          )
        }
      )
    }
  )
})

app.post("/add_restaurant", (req, res) => {
  const values = [
    req.body.restaurantID,
    req.body.name,
    req.body.address,
    req.body.phone,
    req.body.rating,
  ]
  db.query(
    "INSERT INTO restaurant (restaurantID, name, address, phone, rating) VALUES (?, ?, ?, ?, ?)",
    values,
    (err) => {
      if (err) {
        console.error("Error executing query:", err)
        return res.status(500).json({ message: "Server error" })
      }
      res.json({ success: "Restaurant added successfully!" })
    }
  )
})

app.post("/edit_restaurant/:id", (req, res) => {
  db.query(
    "UPDATE restaurant SET name = ?, address = ?, phone = ?, rating = ? WHERE restaurantID = ?",
    [
      req.body.name,
      req.body.address,
      req.body.phone,
      req.body.rating,
      req.params.id,
    ],
    (err) => {
      if (err) {
        console.error("Error executing query:", err)
        return res.status(500).json({ message: "Server error" })
      }
      res.json({ success: "Restaurant updated successfully" })
    }
  )
})

// menu
app.get("/get_menu/:restaurantName", (req, res) => {
  db.query(
    `SELECT 
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
            name = ?)`,
    [req.params.restaurantName],
    (err, result) => {
      if (err) {
        console.error("Error executing query:", err)
        return res.status(500).json({ message: "Server error" })
      }
      res.json(result)
    }
  )
})

app.get("/get_menu_by_id/:restaurantID", (req, res) => {
  db.query(
    `SELECT 
      *
    FROM 
      menuitem
    WHERE 
      restaurantID = ?`,
    [req.params.restaurantID],
    (err, result) => {
      if (err) {
        console.error("Error executing query:", err)
        return res.status(500).json({ message: "Server error" })
      }
      res.json(result)
    }
  )
})

app.delete("/delete_menuitem/:id", (req, res) => {
  db.query(
    `DELETE FROM
        menuitem
      WHERE
        menuitemID = ?`,
    [req.params.id],
    (err) => {
      if (err) {
        console.error("Error executing query:", err)
        return res.status(500).json({ message: "Server error" })
      }
      res.json({ success: "Menu item deleted successfully" })
    }
  )
})

app.get("/menuitems", (req, res) => {
  db.query("SELECT * FROM menuitem", (err, result) => {
    if (err) {
      console.error("Error executing query:", err)
      return res.status(500).json({ message: "Server error" })
    }
    res.json(result)
  })
})

app.post("/add_menuitem", (req, res) => {
  db.query(
    "INSERT INTO menuitem (menuitemID, name, price, description, restaurantID) VALUES (?, ?, ?, ?, ?)",
    [
      req.body.menuitemID,
      req.body.name,
      req.body.price,
      req.body.description,
      req.body.restaurantID,
    ],
    (err) => {
      if (err) {
        console.error("Error executing query:", err)
        return res.status(500).json({ message: "Server error" })
      }
      res.json({ success: "Menu item added successfully!" })
    }
  )
})

// customers
app.get("/customers", (req, res) => {
  db.query("SELECT * FROM customer", (err, result) => {
    if (err) {
      console.error("Error executing query:", err)
      return res.status(500).json({ message: "Server error" })
    }
    res.json(result)
  })
})

app.get("/get_customer/:name", (req, res) => {
  db.query(
    "SELECT * FROM customer WHERE name = ?",
    [req.params.name],
    (err, result) => {
      if (err) {
        console.error("Error executing query:", err)
        return res.status(500).json({ message: "Server error" })
      }
      res.json(result)
    }
  )
})

app.delete("/delete_customer/:id", (req, res) => {
  const { id } = req.params
  db.query(
    `DELETE FROM
      customerorderitem
    WHERE
      customerorderID IN (
        SELECT 
          customerorderID
        FROM
          customerorder
        WHERE
          customerID = ?)`,
    [id],
    (err) => {
      if (err) {
        console.error("Error executing query:", err)
        return res.status(500).json({ message: "Server error" })
      }

      db.query(
        "DELETE FROM customerorder WHERE customerID = ?",
        [id],
        (err) => {
          if (err) {
            console.error("Error executing query:", err)
            return res.status(500).json({ message: "Server error" })
          }

          db.query("DELETE FROM customer WHERE customerID = ?", [id], (err) => {
            if (err) {
              console.error("Error executing query:", err)
              return res.status(500).json({ message: "Server error" })
            }

            res.json({ success: "Customer deleted successfully" })
          })
        }
      )
    }
  )
})

app.post("/add_customer", (req, res) => {
  db.query(
    "INSERT INTO customer (customerID, name, email, phone, address) VALUES (?, ?, ?, ?, ?)",
    [
      req.body.customerID,
      req.body.name,
      req.body.email,
      req.body.phone,
      req.body.address,
    ],
    (err) => {
      if (err) {
        console.error("Error executing query:", err)
        return res.status(500).json({ message: "Server error" })
      }
      res.json({ success: "Customer added successfully!" })
    }
  )
})

// customer orders
app.get("/customerorders/:custid", (req, res) => {
  db.query(
    `SELECT
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
      co.customerID = ?;`,
    [req.params.custid],
    (err, result) => {
      if (err) {
        console.error("Error executing query:", err)
        return res.status(500).json({ message: "Server error" })
      }
      res.json(result)
    }
  )
})

// customer order
app.get("/customerorder/:id", (req, res) => {
  db.query(
    `SELECT 
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
      co.customerorderID = ?;`,
    [req.params.id],
    (err, result) => {
      if (err) {
        console.error("Error executing query:", err)
        return res.status(500).json({ message: "Server error" })
      }
      res.json(result)
    }
  )
})

app.delete("/delete_customerorder/:id", (req, res) => {
  const { id } = req.params
  db.query(
    "DELETE FROM customerorderitem WHERE customerorderID = ?",
    [id],
    (err) => {
      if (err) {
        console.error("Error executing query:", err)
        return res.status(500).json({ message: "Server error" })
      }

      db.query(
        "DELETE FROM customerorder WHERE customerorderID = ?",
        [id],
        (err) => {
          if (err) {
            console.error("Error executing query:", err)
            return res.status(500).json({ message: "Server error" })
          }

          res.json({ success: "Customer order deleted successfully" })
        }
      )
    }
  )
})

app.get("/customerorders", (req, res) => {
  db.query("SELECT * FROM customerorder", (err, result) => {
    if (err) {
      console.error("Error executing query:", err)
      return res.status(500).json({ message: "Server error" })
    }
    res.json(result)
  })
})

app.post("/add_customerorder", (req, res) => {
  db.beginTransaction((err) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Error starting transaction: " + err })
    }

    db.query(
      "INSERT INTO customerorder (customerorderID, customerID, restaurantID, date, paymentStatus, deliveryStatus, employeeID) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [
        req.body.customerorderID,
        req.body.customerID,
        req.body.restaurantID,
        req.body.date,
        req.body.paymentStatus,
        req.body.deliveryStatus,
        req.body.employeeID,
      ],
      (err) => {
        if (err) {
          return db.rollback(() => {
            res
              .status(500)
              .json({ message: "Error inserting into customerorder: " + err })
          })
        }

        const itemQueries = req.body.items
          .map((item) => [
            req.body.customerorderID,
            item.menuitemID,
            item.quantity,
          ])
          .map((orderItem) => {
            return new Promise((resolve, reject) => {
              db.query(
                "INSERT INTO customerorderitem (customerorderID, menuitemID, quantity) VALUES (?, ?, ?)",
                orderItem,
                (err) => {
                  if (err) {
                    return reject(err)
                  }
                  resolve()
                }
              )
            })
          })

        Promise.all(itemQueries)
          .then(() => {
            db.commit((err) => {
              if (err) {
                return db.rollback(() => {
                  res
                    .status(500)
                    .json({ message: "Error committing transaction: " + err })
                })
              }
              res.json({ success: "Order and items added successfully!" })
            })
          })
          .catch((err) => {
            db.rollback(() => {
              res.status(500).json({
                message: "Error inserting into customerorderitem: " + err,
              })
            })
          })
      }
    )
  })
})

// customer order item
app.get("/get_customerorderitems/:orderId", (req, res) => {
  db.query(
    `SELECT
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
      c.customerorderID = ?`,
    [req.params.orderId],
    (err, result) => {
      if (err) {
        console.error("Error executing query:", err)
        return res.status(500).json({ message: "Server error" })
      }
      res.json(result)
    }
  )
})

app.delete("/delete_customerorderitem/:orderId/:itemId", (req, res) => {
  db.query(
    "DELETE FROM customerorderitem WHERE customerorderID = ? AND menuitemID = ?",
    [req.params.orderId, req.params.itemId],
    (err) => {
      if (err) {
        console.error("Error executing query:", err)
        return res.status(500).json({ message: "Server error" })
      }
      res.json({ success: "Customer order item deleted successfully!" })
    }
  )
})

app.post("/add_customerorderitem", (req, res) => {
  db.query(
    "INSERT INTO customerorderitem (customerorderID, menuitemID, quantity) VALUES (?, ?, ?)",
    [req.body.customerorderID, req.body.menuitemID, req.body.quantity],
    (err) => {
      if (err) {
        console.error("Error executing query:", err)
        return res.status(500).json({ message: "Server error" })
      }
      res.json({ success: "Customer order item added successfully!" })
    }
  )
})

// employees
app.get("/employees", (req, res) => {
  db.query("SELECT * FROM employeesview", (err, result) => {
    if (err) {
      console.error("Error executing query:", err)
      return res.status(500).json({ message: "Server error" })
    }
    res.json(result)
  })
})

app.get("/get_employee/:employeeName", (req, res) => {
  db.query(
    `SELECT 
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
      e.name = ?`,
    [req.params.employeeName],
    (err, result) => {
      if (err) {
        console.error("Error executing query:", err)
        return res.status(500).json({ message: "Server error" })
      }
      res.json(result)
    }
  )
})

app.get("/get_employeeorders/:employeeID", (req, res) => {
  db.query(
    `SELECT 
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
      co.employeeID = ?`,
    [req.params.employeeID],
    (err, result) => {
      if (err) {
        console.error("Error executing query:", err)
        return res.status(500).json({ message: "Server error" })
      }
      res.json(result)
    }
  )
})

app.delete("/delete_employee/:id", (req, res) => {
  const { id } = req.params
  db.query("DELETE FROM inventoryorder WHERE employeeID = ?", [id], (err) => {
    if (err) {
      console.error("Error executing query:", err)
      return res.status(500).json({ message: "Server error" })
    }

    db.query(
      `DELETE FROM 
          customerorderitem 
        WHERE
          customerorderID IN 
            (SELECT
                customerorderID
              FROM
                customerorder
              WHERE
                customerID = ?)`,
      [id],
      (err) => {
        if (err) {
          console.error("Error executing query:", err)
          return res.status(500).json({ message: "Server error" })
        }

        db.query(
          "DELETE FROM customerorder WHERE customerID = ?",
          [id],
          (err) => {
            if (err) {
              console.error("Error executing query:", err)
              return res.status(500).json({ message: "Server error" })
            }

            db.query(
              "DELETE FROM employee WHERE employeeID = ?",
              [id],
              (err) => {
                if (err) {
                  console.error("Error executing query:", err)
                  return res.status(500).json({ message: "Server error" })
                }

                res.json({ success: "Employee deleted successfully" })
              }
            )
          }
        )
      }
    )
  })
})

app.post("/add_employee", (req, res) => {
  db.query(
    "INSERT INTO employee (employeeID, name, role, phone, address, salary, restaurantID) VALUES (?, ?, ?, ?, ?, ?, ?)",
    [
      req.body.employeeID,
      req.body.name,
      req.body.role,
      req.body.phone,
      req.body.address,
      req.body.salary,
      req.body.restaurantID,
    ],
    (err) => {
      if (err) {
        console.error("Error executing query:", err)
        return res.status(500).json({ message: "Server error" })
      }
      res.json({ success: "Employee added successfully!" })
    }
  )
})

app.post("/add_employeeorder", (req, res) => {
  db.beginTransaction((err) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Error starting transaction: " + err })
    }

    db.query(
      "INSERT INTO customerorder (customerorderID, customerID, restaurantID, date, paymentStatus, deliveryStatus, employeeID) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [
        req.body.customerorderID,
        req.body.customerID,
        req.body.restaurantID,
        req.body.date,
        req.body.paymentStatus,
        req.body.deliveryStatus,
        req.body.employeeID,
      ],
      (err) => {
        if (err) {
          return db.rollback(() => {
            res
              .status(500)
              .json({ message: "Error inserting into customerorder: " + err })
          })
        }

        const itemQueries = req.body.items
          .map((item) => [
            req.body.customerorderID,
            item.menuitemID,
            item.quantity,
          ])
          .map((orderItem) => {
            return new Promise((resolve, reject) => {
              db.query(
                "INSERT INTO customerorderitem (customerorderID, menuitemID, quantity) VALUES (?, ?, ?)",
                orderItem,
                (err) => {
                  if (err) {
                    return reject(err)
                  }
                  resolve()
                }
              )
            })
          })

        Promise.all(itemQueries)
          .then(() => {
            db.commit((err) => {
              if (err) {
                return db.rollback(() => {
                  res
                    .status(500)
                    .json({ message: "Error committing transaction: " + err })
                })
              }
              res.json({ success: "Order and items added successfully!" })
            })
          })
          .catch((err) => {
            db.rollback(() => {
              res.status(500).json({
                message: "Error inserting into customerorderitem: " + err,
              })
            })
          })
      }
    )
  })
})

// inventory
app.get("/inventory", (req, res) => {
  db.query(
    `SELECT 
      i.*,
      (SELECT
          r.name
        FROM
          restaurant r
        WHERE
          r.restaurantID = i.restaurantID
      ) AS restaurantName
    FROM 
      inventory i;`,
    (err, result) => {
      if (err) {
        console.error("Error executing query:", err)
        return res.status(500).json({ message: "Server error" })
      }
      res.json(result)
    }
  )
})

app.get("/get_inventoryItem/:inventoryName", (req, res) => {
  db.query(
    `SELECT 
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
      i.name = ?`,
    [req.params.inventoryName],
    (err, result) => {
      if (err) {
        console.error("Error executing query:", err)
        return res.status(500).json({ message: "Server error" })
      }
      res.json(result)
    }
  )
})

app.delete("/delete_inventory/:id", (req, res) => {
  const { id } = req.params
  db.query(
    "DELETE FROM inventoryorderitem WHERE inventoryID = ?",
    [id],
    (err) => {
      if (err) {
        console.error("Error executing query:", err)
        return res.status(500).json({ message: "Server error" })
      }
      db.query("DELETE FROM inventory WHERE inventoryID = ?", [id], (err) => {
        if (err) {
          console.error("Error executing query:", err)
          return res.status(500).json({ message: "Server error" })
        }

        res.json({ success: "Inventory deleted successfully" })
      })
    }
  )
})

app.post("/add_inventory", (req, res) => {
  db.query(
    "INSERT INTO inventory (inventoryID, name, quantity, restaurantID) VALUES (?, ?, ?, ?)",
    [
      req.body.inventoryID,
      req.body.name,
      req.body.quantity,
      req.body.restaurantID,
    ],
    (err) => {
      if (err) {
        console.error("Error executing query:", err)
        return res.status(500).json({ message: "Server error" })
      }
      res.json({ success: "Inventory added successfully!" })
    }
  )
})

// inventory orders
app.get("/get_inventoryorders", (req, res) => {
  db.query(
    `SELECT 
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
      inventoryorder io ON ioi.inventoryorderID = io.inventoryorderID`,
    (err, result) => {
      if (err) {
        console.error("Error executing query:", err)
        return res.status(500).json({ message: "Server error" })
      }
      res.json(result)
    }
  )
})

app.get("/get_inventoryorders/:inventoryID", (req, res) => {
  db.query(
    `SELECT 
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
      ioi.inventoryID = ?`,
    [req.params.inventoryID],
    (err, result) => {
      if (err) {
        console.error("Error executing query:", err)
        return res.status(500).json({ message: "Server error" })
      }
      res.json(result)
    }
  )
})

app.get("/get_inventoryorders_by_supplier/:supplierID", (req, res) => {
  db.query(
    `SELECT
      *,
      (SELECT
          r.name
        FROM
          restaurant r
        WHERE
          r.restaurantID = io.restaurantID
      ) AS restaurantName,
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
      io.supplierID = ?`,
    [req.params.supplierID],
    (err, result) => {
      if (err) {
        console.error("Error executing query:", err)
        return res.status(500).json({ message: "Server error" })
      }
      res.json(result)
    }
  )
})

app.get("/get_inventoryorder/:orderID", (req, res) => {
  db.query(
    `SELECT 
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
      io.inventoryorderID = ?`,
    [req.params.orderID],
    (err, result) => {
      if (err) {
        console.error("Error executing query:", err)
        return res.status(500).json({ message: "Server error" })
      }
      res.json(result)
    }
  )
})

app.post("/add_inventoryorder", (req, res) => {
  db.beginTransaction((err) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Error starting transaction: " + err })
    }

    db.query(
      "INSERT INTO inventoryorder (inventoryorderID, supplierID, employeeID, restaurantID, date, paymentStatus, deliveryStatus) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [
        req.body.inventoryorderID,
        req.body.supplierID,
        req.body.employeeID,
        req.body.restaurantID,
        req.body.date,
        req.body.paymentStatus,
        req.body.deliveryStatus,
      ],
      (err) => {
        if (err) {
          return db.rollback(() => {
            res
              .status(500)
              .json({ message: "Error inserting into inventory order: " + err })
          })
        }

        db.query(
          "INSERT INTO inventoryorderitem (inventoryOrderID, inventoryID, quantity, unitPrice) VALUES (?, ?, ?, ?)",
          [
            req.body.inventoryorderID,
            req.body.inventoryID,
            req.body.quantity,
            req.body.unitPrice,
          ],
          (err) => {
            if (err) {
              return db.rollback(() => {
                res.status(500).json({
                  message: "Error inserting into inventory order item: " + err,
                })
              })
            }

            db.commit((err) => {
              if (err) {
                return db.rollback(() => {
                  res
                    .status(500)
                    .json({ message: "Error committing transaction: " + err })
                })
              }
              res.json({ success: "Inventory item order added successfully!" })
            })
          }
        )
      }
    )
  })
})

app.get("/get_inventoryorderitems/:orderId", (req, res) => {
  db.query(
    `SELECT 
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
      ioi.inventoryorderID = ?`,
    [req.params.orderId],
    (err, result) => {
      if (err) {
        console.error("Error executing query:", err)
        return res.status(500).json({ message: "Server error" })
      }
      res.json(result)
    }
  )
})

app.delete("/delete_inventoryorder/:id", (req, res) => {
  const { id } = req.params
  db.query(
    "DELETE FROM inventoryorderitem WHERE inventoryorderID = ?",
    [id],
    (err) => {
      if (err) {
        console.error("Error executing query:", err)
        return res.status(500).json({ message: "Server error" })
      }

      db.query(
        "DELETE FROM inventoryorder WHERE inventoryorderID = ?",
        [id],
        (err) => {
          if (err) {
            console.error("Error executing query:", err)
            return res.status(500).json({ message: "Server error" })
          }

          res.json({ success: "Inventory deleted successfully" })
        }
      )
    }
  )
})

app.delete("/delete_inventoryorderitem/:orderId/:itemId", (req, res) => {
  db.query(
    "DELETE FROM inventoryorderitem WHERE inventoryorderID = ? AND inventoryID = ?",
    [req.params.orderId, req.params.itemId],
    (err) => {
      if (err) {
        console.error("Error executing query:", err)
        return res.status(500).json({ message: "Server error" })
      }
      res.json({ success: "Inventory order deleted successfully" })
    }
  )
})

// supplier
app.get("/suppliers", (req, res) => {
  db.query("SELECT * FROM supplier", (err, result) => {
    if (err) {
      console.error("Error executing query:", err)
      return res.status(500).json({ message: "Server error" })
    }
    res.json(result)
  })
})

app.get("/get_supplier/:supplierName", (req, res) => {
  db.query(
    "SELECT * FROM supplier WHERE name = ?",
    [req.params.supplierName],
    (err, result) => {
      if (err) {
        console.error("Error executing query:", err)
        return res.status(500).json({ message: "Server error" })
      }
      res.json(result)
    }
  )
})

app.delete("/delete_supplier/:id", (req, res) => {
  const { id } = req.params
  db.query("DELETE FROM inventoryorder WHERE supplierID = ?", [id], (err) => {
    if (err) {
      console.error("Error executing query:", err)
      return res.status(500).json({ message: "Server error" })
    }

    db.query("DELETE FROM supplier WHERE supplierID = ?", [id], (err) => {
      if (err) {
        console.error("Error executing query:", err)
        return res.status(500).json({ message: "Server error" })
      }
      res.json({ success: "Supplier deleted successfully" })
    })
  })
})

app.post("/add_supplier", (req, res) => {
  db.query(
    "INSERT INTO supplier (supplierID, name, contactPerson, phone, address) VALUES (?, ?, ?, ?, ?)",
    [
      req.body.supplierID,
      req.body.name,
      req.body.contactPerson,
      req.body.phone,
      req.body.address,
    ],
    (err) => {
      if (err) {
        console.error("Error executing query:", err)
        return res.status(500).json({ message: "Server error" })
      }
      res.json({ success: "Supplier added successfully!" })
    }
  )
})

app.post("/add_supplierorder", (req, res) => {
  db.beginTransaction((err) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Error starting transaction: " + err })
    }

    db.query(
      "INSERT INTO inventoryorder (inventoryorderID, supplierID, employeeID, restaurantID, date, paymentStatus, deliveryStatus) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [
        req.body.inventoryorderID,
        req.body.supplierID,
        req.body.employeeID,
        req.body.restaurantID,
        req.body.date,
        req.body.paymentStatus,
        req.body.deliveryStatus,
      ],
      (err) => {
        if (err) {
          return db.rollback(() => {
            res
              .status(500)
              .json({ message: "Error inserting into supplierorder: " + err })
          })
        }

        Promise.all(
          req.body.items
            .map((item) => [
              req.body.inventoryorderID,
              item.inventoryID,
              item.quantity,
              item.unitPrice,
            ])
            .map((orderItem) => {
              return new Promise((resolve, reject) => {
                db.query(
                  "INSERT INTO inventoryorderitem (inventoryorderID, inventoryID, quantity, unitPrice) VALUES (?, ?, ?, ?)",
                  orderItem,
                  (err) => {
                    if (err) {
                      return reject(err)
                    }
                    resolve()
                  }
                )
              })
            })
        )
          .then(() => {
            db.commit((err) => {
              if (err) {
                return db.rollback(() => {
                  res
                    .status(500)
                    .json({ message: "Error committing transaction: " + err })
                })
              }
              res.json({ success: "Order and items added successfully!" })
            })
          })
          .catch((err) => {
            db.rollback(() => {
              res.status(500).json({
                message: "Error inserting into supplierorderitem: " + err,
              })
            })
          })
      }
    )
  })
})

app.post("/add_supplierorderitem", (req, res) => {
  db.query(
    "INSERT INTO inventoryorderitem (inventoryorderID, inventoryID, quantity, unitPrice) VALUES (?, ?, ?, ?)",
    [
      req.body.inventoryorderID,
      req.body.inventoryID,
      req.body.quantity,
      req.body.unitPrice,
    ],
    (err) => {
      if (err) {
        console.error("Error executing query:", err)
        return res.status(500).json({ message: "Server error" })
      }
      res.json({ success: "Supplier order item added successfully!" })
    }
  )
})
