const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const path = require("path");
const app = express();
//path.resolve()
app.use(express.static(path.join(__dirname, "public")));
app.use(cors());
app.use(express.json());

const port = process.env.DB_PORT;
const dbConfig = { 
  host: process.env.DB_HOST, 
  user: process.env.DB_USER, 
  password: process.env.DB_PASSWORD, 
  database: process.env.DB_NAME 
}

let db;

function handleDisconnect() {
  db = mysql.createConnection(dbConfig); // Recreate the connection

  db.connect((err) => {
    if (err) {
      console.error("Error connecting to the database:", err);
      setTimeout(handleDisconnect, 2000); // Retry connection after 2 seconds
    } else {
      console.log("Connected to the database");
    }
  });

  db.on("error", (err) => {
    console.error("Database error:", err);
    if (err.code === "PROTOCOL_CONNECTION_LOST") {
      handleDisconnect(); // Reconnect when the connection is lost
    } else {
      throw err;
    }
  });
}

handleDisconnect();

app.get("/", (req, res) => { res.send("Welcome to the BonAppetit API!"); });

// restaurants
app.get("/restaurants", (req, res) => {
  const sql = "SELECT * FROM restaurant";
  db.query(sql, (err, result) => {
    if (err) {
      console.error("Error executing query:", err);
      return res.status(500).json({ message: "Server error" });
    }
    res.json(result);
  });
});

app.post("/add_restaurant", (req, res) => {
  const sql =
    "INSERT INTO restaurant (restaurantID, name, address, phone, rating) VALUES (?, ?, ?, ?, ?)";
  const values = [req.body.restaurantID, req.body.name, req.body.address, req.body.phone, req.body.rating];
  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("Error executing query:", err);
      return res.status(500).json({ message: "Server error" });
    }
    res.json({ success: "Restaurant added successfully!" });
  });
});

app.get("/get_restaurant_name/:id", (req, res) => {
  const id = req.params.id;
  const sql = "SELECT name FROM restaurant WHERE restaurantID = ?";
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error("Error executing query:", err);
      return res.status(500).json({ message: "Server error" });
    }
    res.json(result);
  });
});

app.get("/get_restaurant/:restaurantName", (req, res) => {
  const restaurantName = req.params.restaurantName;
  const sql = "SELECT * FROM restaurant WHERE name = ?";
  db.query(sql, [restaurantName], (err, result) => {
    if (err) {
      console.error("Error executing query:", err);
      return res.status(500).json({ message: "Server error" });
    }
    res.json(result);
  });
});

app.post("/edit_restaurant/:id", (req, res) => {
  const id = req.params.id;
  const sql =
    "UPDATE restaurant SET name=?, address=?, phone=?, rating=? WHERE restaurantID=?";
  const values = [
    req.body.name,
    req.body.address,
    req.body.phone,
    req.body.rating,
    id,
  ];
  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("Error executing query:", err);
      return res.status(500).json({ message: "Server error" });
    }
    res.json({ success: "Restaurant updated successfully" });
  });
});

app.delete("/delete_restaurant/:id", (req, res) => {
  const id = req.params.id;
  const sql = "DELETE FROM restaurant WHERE restaurantID = ?";
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error("Error executing query:", err);
      return res.status(500).json({ message: "Server error" });
    }
    res.json({ success: "Restaurant deleted successfully" });
  });
});

// menuItem
app.get("/menuitems", (req, res) => {
  const sql = "SELECT * FROM menuitem";
  db.query(sql, (err, result) => {
    if (err) {
      console.error("Error executing query:", err);
      return res.status(500).json({ message: "Server error" });
    }
    res.json(result);
  });
});

app.get("/get_menu/:restaurantName", (req, res) => {
  const restaurantName = req.params.restaurantName;
  const sql = `
    SELECT m.*
    FROM menuItem m
    JOIN restaurant r ON m.restaurantID = r.restaurantID
    WHERE r.name = ?`;
  db.query(sql, [restaurantName], (err, result) => {
    if (err) {
      console.error("Error executing query:", err);
      return res.status(500).json({ message: "Server error" });
    }
    res.json(result);
  });
});

app.post("/add_menuitem", (req, res) => {
  const sql =
    "INSERT INTO menuitem (menuitemID, name, price, description, restaurantID) VALUES (?, ?, ?, ?, ?)";
  const values = [req.body.menuitemID, req.body.name, req.body.price, req.body.description, req.body.restaurantID];
  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("Error executing query:", err);
      return res.status(500).json({ message: "Server error" });
    }
    res.json({ success: "Menu item added successfully!" });
  });
});

app.get("/get_menuitem/:id", (req, res) => {
  const id = req.params.id;
  const sql = "SELECT * FROM menuItem WHERE menuitemID = ?";
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error("Error executing query:", err);
      return res.status(500).json({ message: "Server error" });
    }
    res.json(result);
  });
});

app.post("/edit_menuitem/:id", (req, res) => {
  const id = req.params.id;
  const sql =
    "UPDATE menuItem SET name=?, price=?, description=?, restaurantID=? WHERE menuitemID=?";
  const values = [
    req.body.name,
    req.body.price,
    req.body.description,
    req.body.restaurantID,
    id,
  ];
  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("Error executing query:", err);
      return res.status(500).json({ message: "Server error" });
    }
    res.json({ success: "Menu item updated successfully" });
  });
});

app.delete("/delete_menuitem/:id", (req, res) => {
  const id = req.params.id;
  const sql = "DELETE FROM menuItem WHERE menuitemID = ?";
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error("Error executing query:", err);
      return res.status(500).json({ message: "Server error" });
    }
    res.json({ success: "Menu item deleted successfully" });
  });
});

// employee
app.get("/employees", (req, res) => {
  const sql = "SELECT * FROM employee";
  db.query(sql, (err, result) => {
    if (err) {
      console.error("Error executing query:", err);
      return res.status(500).json({ message: "Server error" });
    }
    res.json(result);
  });
});

app.post("/add_employee", (req, res) => {
  const sql =
    "INSERT INTO employee (employeeID, name, role, phone, address, salary, restaurantID) VALUES (?, ?, ?, ?, ?, ?, ?)";
  const values = [req.body.employeeID, req.body.name, req.body.role, req.body.phone, req.body.address, req.body.salary, req.body.restaurantID];
  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("Error executing query:", err);
      return res.status(500).json({ message: "Server error" });
    }
    res.json({ success: "Employee added successfully!" });
  });
});

app.post("/edit_employee/:id", (req, res) => {
  const id = req.params.id;
  const sql =
    "UPDATE employee SET name=?, role=?, phone=?, address=?, salary=?, restaurantID=? WHERE employeeID=?";
  const values = [
    req.body.name,
    req.body.role,
    req.body.phone,
    req.body.address,
    req.body.salary,
    req.body.restaurantID,
    id,
  ];
  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("Error executing query:", err);
      return res.status(500).json({ message: "Server error" });
    }
    res.json({ success: "Employee updated successfully" });
  });
});

app.delete("/delete_employee/:id", (req, res) => {
  const id = req.params.id;
  const sql = "DELETE FROM employee WHERE employeeID = ?";
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error("Error executing query:", err);
      return res.status(500).json({ message: "Server error" });
    }
    res.json({ success: "Employee deleted successfully" });
  });
});

app.get("/employee_view", (req, res) => {
  const sql = `SELECT * FROM employeeview`;
  db.query(sql, (err, result) => {
    if (err) {
      console.error("Error executing query:", err);
      return res.status(500).json({ message: "Server error" });
    }
    res.json(result);
  });
});

// supplier
app.get("/suppliers", (req, res) => {
  const sql = "SELECT * FROM supplier";
  db.query(sql, (err, result) => {
    if (err) {
      console.error("Error executing query:", err);
      return res.status(500).json({ message: "Server error" });
    }
    res.json(result);
  });
});

app.post("/add_supplier", (req, res) => {
  const sql =
    "INSERT INTO supplier (supplierID, name, contactperson, phone, address) VALUES (?, ?, ?, ?, ?)";
  const values = [req.body.supplierID, req.body.name, req.body.contactperson, req.body.phone, req.body.address];
  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("Error executing query:", err);
      return res.status(500).json({ message: "Server error" });
    }
    res.json({ success: "Supplier added successfully!" });
  });
});

app.get("/get_supplier_name/:id", (req, res) => {
  const id = req.params.id;
  const sql = "SELECT name FROM supplier WHERE supplierID = ?";
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error("Error executing query:", err);
      return res.status(500).json({ message: "Server error" });
    }
    res.json(result);
  });
});

app.post("/edit_supplier/:id", (req, res) => {
  const id = req.params.id;
  const sql =
    "UPDATE supplier SET name=?, contactperson=?, phone=?, address=? WHERE supplierID=?";
  const values = [
    req.body.name,
    req.body.contactperson,
    req.body.phone,
    req.body.address,
    id,
  ];
  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("Error executing query:", err);
      return res.status(500).json({ message: "Server error" });
    }
    res.json({ success: "Supplier updated successfully" });
  });
});

app.delete("/delete_supplier/:id", (req, res) => {
  const id = req.params.id;
  const sql = "DELETE FROM supplier WHERE supplierID = ?";
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error("Error executing query:", err);
      return res.status(500).json({ message: "Server error" });
    }
    res.json({ success: "Supplier deleted successfully" });
  });
});

// inventory
app.get("/inventory", (req, res) => {
  const sql = "SELECT * FROM inventory";
  db.query(sql, (err, result) => {
    if (err) {
      console.error("Error executing query:", err);
      return res.status(500).json({ message: "Server error" });
    }
    res.json(result);
  });
});

app.post("/add_inventory", (req, res) => {
  const sql =
    "INSERT INTO inventory (inventoryID, name, quantity, unitPrice, restaurantID, supplierID) VALUES (?, ?, ?, ?, ?, ?)";
  const values = [req.body.inventoryID, req.body.name, req.body.quantity, req.body.unitPrice, req.body.restaurantID, req.body.supplierID];
  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("Error executing query:", err);
      return res.status(500).json({ message: "Server error" });
    }
    res.json({ success: "Inventory added successfully!" });
  });
});

app.get("/get_inventory/:inventoryName", (req, res) => {
  const inventoryName = req.params.inventoryName;
  const sql = "SELECT * FROM inventory WHERE name = ?";
  db.query(sql, [inventoryName], (err, result) => {
    if (err) {
      console.error("Error executing query:", err);
      return res.status(500).json({ message: "Server error" });
    }
    res.json(result);
  });
});

app.get("/get_inventory_names", (req, res) => {
  const sql = "SELECT inventoryID as id, name FROM inventory";
  db.query(sql, (err, results) => {
    if (err) {
      return res.json({ message: "Server error" });
    }
    return res.json(results);
  });
});

app.post("/edit_inventory/:id", (req, res) => {
  const id = req.params.id;
  const sql =
    "UPDATE inventory SET name=?, quantity=?, unitPrice=?, restaurantID=?, supplierID=? WHERE inventoryID=?";
  const values = [
    req.body.name,
    req.body.quantity,
    req.body.unitPrice,
    req.body.restaurantID,
    req.body.supplierID,
    id,
  ];
  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("Error executing query:", err);
      return res.status(500).json({ message: "Server error" });
    }
    res.json({ success: "Inventory updated successfully" });
  });
});

app.delete("/delete_inventory/:id", (req, res) => {
  const id = req.params.id;
  const sql = "DELETE FROM inventory WHERE inventoryID = ?";
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error("Error executing query:", err);
      return res.status(500).json({ message: "Server error" });
    }
    res.json({ success: "Inventory deleted successfully" });
  });
});

app.get("/inventory_view", (req, res) => {
  const sql = `SELECT * FROM inventoryview`;
  db.query(sql, (err, result) => {
    if (err) {
      console.error("Error executing query:", err);
      return res.status(500).json({ message: "Server error" });
    }
    res.json(result);
  });
});

app.post("/add_inventoryorder", (req, res) => {
  const sql =
    "INSERT INTO inventoryorder (inventoryOrderID, supplierID, employeeID, restaurantID, unitPrice, quantity, date, paymentStatus, deliveryStatus) VALUES (?, ?, ?, ?, ?, ?, ?)";
  const values = [req.body.inventoryOrderID, req.body.supplierID, req.body.employeeID, req.body.restaurantID, req.body.date, req.body.paymentStatus, req.body.deliveryStatus];
  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("Error executing query:", err);
      return res.status(500).json({ message: "Server error" });
    }
    res.json({ success: "Inventory order added successfully!" });
  });
});

app.post("/add_inventoryorder_items", (req, res) => {
  const inventoryOrderSql =
    "INSERT INTO inventoryorder (supplierID, employeeID, restaurantID, date, paymentStatus, deliveryStatus) VALUES (?, ?, ?, ?, ?, ?)";

  const inventoryOrderValues = [
    req.body.supplierID,
    req.body.employeeID,
    req.body.restaurantID,
    req.body.date,
    req.body.paymentStatus,
    req.body.deliveryStatus,
  ];

  // Start a transaction
  db.beginTransaction((err) => {
    if (err) {
      return res.json({ message: "Something unexpected has occurred: " + err });
    }

    db.query(inventoryOrderSql, inventoryOrderValues, (err, result) => {
      if (err) {
        return db.rollback(() => {
          return res.json({ message: "Something unexpected has occurred: " + err });
        });
      }

      const inventoryOrderID = result.insertId;
      const inventoryOrderItemSql =
        "INSERT INTO inventoryorderItem (inventoryOrderID, inventoryID, quantity, unitPrice) VALUES (?, ?, ?, ?)";

      const inventoryOrderItemValues = req.body.items.map(item => [
        inventoryOrderID,
        item.inventoryID,
        item.quantity,
        item.unitPrice,
      ]);

      // Insert each inventory order item
      db.query(inventoryOrderItemSql, [inventoryOrderItemValues], (err, result) => {
        if (err) {
          return db.rollback(() => {
            return res.json({ message: "Something unexpected has occurred: " + err });
          });
        }

        // Commit the transaction
        db.commit((err) => {
          if (err) {
            return db.rollback(() => {
              return res.json({ message: "Something unexpected has occurred: " + err });
            });
          }

          res.json({ success: "Inventory order and items added successfully!" });
        });
      });
    });
  });
});

app.post("/edit_inventoryorder/:id", (req, res) => {
  const id = req.params.id;
  const sql =
    "UPDATE inventoryorder SET supplierID=?, employeeID=?, restaurantID=?, date=?, paymentStatus=?, deliveryStatus=? WHERE inventoryOrderID=?";
  const values = [
    req.body.supplierID,
    req.body.employeeID,
    req.body.restaurantID,
    req.body.date,
    req.body.paymentStatus,
    req.body.deliveryStatus,
    id,
  ];
  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("Error executing query:", err);
      return res.status(500).json({ message: "Server error" });
    }
    res.json({ success: "Inventory order updated successfully" });
  });
});

app.delete("/delete_inventoryorder/:id", (req, res) => {
  const id = req.params.id;
  const sql = "DELETE FROM inventoryorder WHERE inventoryOrderID = ?";
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error("Error executing query:", err);
      return res.status(500).json({ message: "Server error" });
    }
    res.json({ success: "Inventory order deleted successfully" });
  });
});

app.get("/inventoryorders_view", (req, res) => {
  const sql = "SELECT * from inventoryordersview";
  db.query(sql, (err, result) => {
    if (err) {
      console.error("Error executing query:", err);
      return res.status(500).json({ message: "Server error" });
    }
    res.json(result);
  });
});

// inventoryorderItem
app.get("/inventory_order_items", (req, res) => {
  const sql = "SELECT * FROM inventoryorderItem";
  db.query(sql, (err, result) => {
    if (err) {
      console.error("Error executing query:", err);
      return res.status(500).json({ message: "Server error" });
    }
    res.json(result);
  });
});

app.post("/add_inventoryorderitem", (req, res) => {
  const sql =
    "INSERT INTO inventoryorderItem (inventoryOrderID, inventoryID, quantity, unitPrice) VALUES (?, ?, ?, ?)";
  const values = [req.body.inventoryOrderID, req.body.inventoryID, req.body.quantity, req.body.unitPrice];
  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("Error executing query:", err);
      return res.status(500).json({ message: "Server error" });
    }
    res.json({ success: "Inventory order item added successfully!" });
  });
});

app.get("/get_inventoryorderitem/:id", (req, res) => {
  const id = req.params.id;
  const sql = `
  SELECT i.name, 
        ioi.quantity, 
        ioi.unitPrice 
  FROM inventoryorderitem ioi
  JOIN inventory i ON i.inventoryID = ioi.inventoryID
  WHERE inventoryOrderID = ?;  
  `;
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error("Error executing query:", err);
      return res.status(500).json({ message: "Server error" });
    }
    res.json(result);
  });
});

app.post("/edit_inventoryorderitem/:id", (req, res) => {
  const id = req.params.id;
  const sql =
    "UPDATE inventoryorderitem SET quantity=?, inventoryID=?, unitPrice=? WHERE inventoryOrderID=?";
  const values = [
    req.body.quantity,
    req.body.unitPrice,
    req.body.inventoryID,
    id,
  ];
  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("Error executing query:", err);
      return res.status(500).json({ message: "Server error" });
    }
    res.json({ success: "Inventory order item updated successfully" });
  });
});

app.delete("/delete_inventory_order_item", (req, res) => {
  const { inventoryOrderID, inventoryID } = req.params;
  const sql = "DELETE FROM inventoryorderItem WHERE inventoryOrderID = ? AND inventoryID = ?";
  db.query(sql, [inventoryOrderID, inventoryID], (err, result) => {
    if (err) {
      console.error("Error executing query:", err);
      return res.status(500).json({ message: "Server error" });
    }
    res.json({ success: "Inventory order item deleted successfully" });
  });
});

app.get("/count_inventoryorders", (req, res) => {
  const sql = "SELECT count(inventoryOrderID) as total FROM inventoryorder";
  db.query(sql, (err, result) => {
    if (err) {
      console.error("Error executing query:", err);
      return res.status(500).json({ message: "Server error" });
    }
    res.json(result);
  });
});

// customer
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

app.post("/add_customer", (req, res) => {
  const sql =
    "INSERT INTO customer (customerID, name, email, phone, address) VALUES (?, ?, ?, ?, ?)";
  const values = [req.body.customerID, req.body.name, req.body.email, req.body.phone, req.body.address];
  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("Error executing query:", err);
      return res.status(500).json({ message: "Server error" });
    }
    res.json({ success: "Customer added successfully!" });
  });
});

app.get("/get_customer/:name", (req, res) => {
  const name = req.params.name;
  const sql = "SELECT * FROM customer WHERE name = ?";
  db.query(sql, [name], (err, result) => {
    if (err) {
      console.error("Error executing query:", err);
      return res.status(500).json({ message: "Server error" });
    }
    res.json(result);
  });
});

app.post("/edit_customer/:id", (req, res) => {
  const id = req.params.id;
  const sql =
    "UPDATE customer SET name=?, email=?, phone=?, address=? WHERE customerID=?";
  const values = [
    req.body.name,
    req.body.email,
    req.body.phone,
    req.body.address,
    id,
  ];
  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("Error executing query:", err);
      return res.status(500).json({ message: "Server error" });
    }
    res.json({ success: "Customer updated successfully" });
  });
});

app.delete("/delete_customer/:id", (req, res) => {
  const id = req.params.id;
  const sql = "DELETE FROM customer WHERE customerID = ?";
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error("Error executing query:", err);
      return res.status(500).json({ message: "Server error" });
    }
    res.json({ success: "Customer deleted successfully" });
  });
});

// customerOrder
app.get("/customerorders", (req, res) => {
  const sql = "SELECT * FROM customerorder";
  db.query(sql, (err, result) => {
    if (err) {
      console.error("Error executing query:", err);
      return res.status(500).json({ message: "Server error" });
    }
    res.json(result);
  });
});

app.get("/customerorders/:custid", (req, res) => {
  const custid = req.params.custid;
  const sql = `
    SELECT 
      co.customerOrderID,
      r.name AS restaurantName,
      co.date,
      co.paymentStatus,
      co.deliveryStatus
  FROM 
      customerOrder co
  JOIN 
      restaurant r ON co.restaurantID = r.restaurantID
  WHERE 
      co.customerID = ?;`
  db.query(sql, [custid], (err, result) => {
    if (err) {
      console.error("Error executing query:", err);
      return res.status(500).json({ message: "Server error" });
    }
    res.json(result);
  });
});

app.get("/customerorder/:id", (req, res) => {
  const id = req.params.id;
  const sql = `
  SELECT 
    co.customerOrderID,
    co.customerID,
    r.name AS restaurantName,
    co.date,
    co.paymentStatus,
    co.deliveryStatus
  FROM 
      customerOrder co
  JOIN 
      restaurant r ON co.restaurantID = r.restaurantID
  WHERE 
      co.customerOrderID = ?;`
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error("Error executing query:", err);
      return res.status(500).json({ message: "Server error" });
    }
    res.json(result);
  });
});

// app.post("/add_customerorder", (req, res) => {
//   const sql =
//     "INSERT INTO customerOrder (customerOrderID, customerID, restaurantID, date, paymentStatus, deliveryStatus) VALUES (?, ?, ?, ?, ?, ?)";
//   const values = [req.body.customerOrderID, req.body.customerID, req.body.restaurantID, req.body.date, req.body.paymentStatus, req.body.deliveryStatus];
//   db.query(sql, values, (err, result) => {
//     if (err) {
//       console.error("Error executing query:", err);
//       return res.status(500).json({ message: "Server error" });
//     }
//     res.json({ success: "Customer order added successfully!" });
//   });
// });

app.post("/add_customerorder", (req, res) => {
  const {
    customerID,
    date,
    customerorderID,
    items,
    restaurantID,
    paymentStatus,
    deliveryStatus
  } = req.body;

  const orderSql = `
    INSERT INTO customerOrder (customerOrderID, customerID, restaurantID, date, paymentStatus, deliveryStatus)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  const itemSql = `
    INSERT INTO customerOrderItem (customerOrderID, menuItemID, quantity)
    VALUES (?, ?, ?)
  `;

  db.beginTransaction((err) => {
    if (err) {
      return res.status(500).json({ message: "Error starting transaction: " + err });
    }

    db.query(orderSql, [customerorderID, customerID, restaurantID, date, paymentStatus, deliveryStatus], (err, result) => {
      if (err) {
        return db.rollback(() => {
          res.status(500).json({ message: "Error inserting into customerOrder: " + err });
        });
      }

      const orderItems = items.map(item => [customerorderID, item.menuitemID, item.quantity]);

      db.query(itemSql, [orderItems], (err, result) => {
        if (err) {
          return db.rollback(() => {
            res.status(500).json({ message: "Error inserting into customerOrderItem: " + err });
          });
        }

        db.commit((err) => {
          if (err) {
            return db.rollback(() => {
              res.status(500).json({ message: "Error committing transaction: " + err });
            });
          }
          res.json({ success: "Order and items added successfully!" });
        });
      });
    });
  });
});


app.post("/edit_customerorder/:id", (req, res) => {
  const id = req.params.id;
  const sql =
    "UPDATE customerOrder SET customerID=?, restaurantID=?, date=?, paymentStatus=?, deliveryStatus=? WHERE customerOrderID=?";
  const values = [
    req.body.customerID,
    req.body.restaurantID,
    req.body.date,
    req.body.paymentStatus,
    req.body.deliveryStatus,
    id,
  ];
  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("Error executing query:", err);
      return res.status(500).json({ message: "Server error" });
    }
    res.json({ success: "Customer order updated successfully" });
  });
});

app.delete("/delete_customerorder/:id", (req, res) => {
  const id = req.params.id;
  const sql = "DELETE FROM customerOrder WHERE customerOrderID = ?";
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error("Error executing query:", err);
      return res.status(500).json({ message: "Server error" });
    }
    res.json({ success: "Customer order deleted successfully" });
  });
});

// customerOrderitem
app.get("/customerorderitems", (req, res) => {
  const sql = "SELECT * FROM customerOrderItem";
  db.query(sql, (err, result) => {
    if (err) {
      console.error("Error executing query:", err);
      return res.status(500).json({ message: "Server error" });
    }
    res.json(result);
  });
});

app.post("/add_customerorderitem", (req, res) => {
  const sql =
    "INSERT INTO customerOrderItem (customerOrderID, menuItemID) VALUES (?, ?)";
  const values = [req.body.customerOrderID, req.body.menuItemID];
  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("Error executing query:", err);
      return res.status(500).json({ message: "Server error" });
    }
    res.json({ success: "Customer order item added successfully!" });
  });
});

app.get("/get_customerorderitems/:orderId", (req, res) => {
  const { orderId } = req.params;
  const sql = "SELECT m.name as menuItemName, quantity FROM customerOrderItem c JOIN menuitem m ON m.menuitemID=c.menuitemID WHERE c.customerOrderID = ?";
  db.query(sql, [orderId], (err, result) => {
    if (err) {
      console.error("Error executing query:", err);
      return res.status(500).json({ message: "Server error" });
    }
    res.json(result);
  });
});

app.post("/edit_customerorderitems/:orderId", (req, res) => {
  const { orderId } = req.params;
  const items = req.body.items;

  const sql = "UPDATE customerorderitem SET menuItemID = ?, quantity = ? WHERE customerOrderID = ? AND menuItemID = ?";

  items.forEach((item) => {
    const values = [
      item.newMenuitemID,
      item.quantity,
      orderId,
      item.menuitemID
    ];

    db.query(sql, values, (err, result) => {
      if (err) {
        console.error("Something unexpected has occurred", err);
        return res.json({ message: "Something unexpected has occurred" + err });
      }
      console.log("Customer order item updated successfully!");
    });
  });

  res.json({ success: "Customer order items updated successfully!" });
});

app.delete("/delete_customerorderitem/:orderId/:itemId", (req, res) => {
  const { orderId, itemId } = req.params;
  const sql = "DELETE FROM customerOrderItem WHERE customerOrderID = ? AND menuItemID = ?";
  db.query(sql, [orderId, itemId], (err, result) => {
    if (err) {
      console.error("Error executing query:", err);
      return res.status(500).json({ message: "Server error" });
    }
    res.json({ success: "Customer order item deleted successfully!" });
  });
});

// Expensive Menu Items by Restaurant
app.get("/expensive_menu_items", (req, res) => {
  const sql = `
    SELECT RestaurantID, COUNT(MenuItemID) AS ExpensiveMenuItems
    FROM MenuItem
    WHERE Price > 10  -- Specify price threshold
    GROUP BY RestaurantID
  `;
  db.query(sql, (err, result) => {
    if (err) {
      console.error("Error executing query:", err);
      return res.status(500).json({ message: "Server error" });
    }
    res.json(result);
  });
});

// Most Recent Inventory Order by Restaurant
app.get("/most_recent_inventory_order", (req, res) => {
  const sql = `
    SELECT RestaurantID, MAX(Date) AS MostRecentOrder
    FROM InventoryOrder
    GROUP BY RestaurantID
  `;
  db.query(sql, (err, result) => {
    if (err) {
      console.error("Error executing query:", err);
      return res.status(500).json({ message: "Server error" });
    }
    res.json(result);
  });
});

// Total Payment by Restaurant for a Specific Year
app.get("/total_payment_by_restaurant", (req, res) => {
  const sql = `
    SELECT RestaurantID, SUM(TotalAmount) AS TotalPayment
    FROM CustomerOrder
    WHERE Date BETWEEN '2024-01-01' AND '2024-12-31'
    GROUP BY RestaurantID
  `;
  db.query(sql, (err, result) => {
    if (err) {
      console.error("Error executing query:", err);
      return res.status(500).json({ message: "Server error" });
    }
    res.json(result);
  });
});

// Menu Items with Highest Price by Restaurant
app.get("/highest_price_menu_items", (req, res) => {
  const sql = `
    SELECT RestaurantID, MenuItemID, Name, Price
    FROM MenuItem
    WHERE (RestaurantID, Price) IN (
        SELECT RestaurantID, MAX(Price)
        FROM MenuItem
        GROUP BY RestaurantID
    )
  `;
  db.query(sql, (err, result) => {
    if (err) {
      console.error("Error executing query:", err);
      return res.status(500).json({ message: "Server error" });
    }
    res.json(result);
  });
});

// Menu Items Priced Above Average
app.get("/above_average_price_menu_items", (req, res) => {
  const sql = `
    SELECT MenuItemID, Name, Price
    FROM MenuItem
    WHERE Price > (SELECT AVG(Price) FROM MenuItem)
  `;
  db.query(sql, (err, result) => {
    if (err) {
      console.error("Error executing query:", err);
      return res.status(500).json({ message: "Server error" });
    }
    res.json(result);
  });
});

// Top 5 Ordered Menu Items
app.get("/top_ordered_menu_items", (req, res) => {
  const sql = `
    SELECT MenuItemID, COUNT(*) AS OrderCount
    FROM CustomerOrderItem
    GROUP BY MenuItemID
    ORDER BY OrderCount DESC
    LIMIT 5
  `;
  db.query(sql, (err, result) => {
    if (err) {
      console.error("Error executing query:", err);
      return res.status(500).json({ message: "Server error" });
    }
    res.json(result);
  });
});

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

app.listen(port, () => {
  console.log(`listening on port ${port} `);
}); 