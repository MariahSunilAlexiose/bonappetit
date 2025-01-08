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

app.get("/", (req, res) => { 
  res.send("Welcome to the BonAppetit API!"); 
});

// DASHBOARD
app.get("/total_sales", (req, res) => {
  const sql = `
  SELECT ROUND(SUM(c.quantity * m.price), 2) AS total_sales
  FROM customerorderitem c
  JOIN menuitem m ON c.menuitemID = m.menuitemID;
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
          FROM customerorderItem oi
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

// RESTAURANTS
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

app.get("/get_restaurant/:name", (req, res) => {
  const {name} = req.params;
  const sql = "SELECT * FROM restaurant WHERE name = ?";
  db.query(sql, [name], (err, result) => {
    if (err) {
      console.error("Error executing query:", err);
      return res.status(500).json({ message: "Server error" });
    }
    res.json(result);
  });
});

app.get("/get_restaurant_name/:id", (req, res) => {
  const {id} = req.params;
  const sql = "SELECT name FROM restaurant WHERE restaurantID = ?";
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error("Error executing query:", err);
      return res.status(500).json({ message: "Server error" });
    }
    res.json(result);
  });
});

app.post("/add_restaurant", (req, res) => {
  const { restaurantID, name, address, phone, rating } = req.body;
  const sql =
    "INSERT INTO restaurant (restaurantID, name, address, phone, rating) VALUES (?, ?, ?, ?, ?)";
  db.query(sql, [restaurantID, name, address, phone, rating], (err) => {
    if (err) {
      console.error("Error executing query:", err);
      return res.status(500).json({ message: "Server error" });
    }
    res.json({ success: "Restaurant added successfully!" });
  });
});

app.post("/edit_restaurant/:id", (req, res) => {
  const {id} = req.params;
  const sql =
    "UPDATE restaurant SET name=?, address=?, phone=?, rating=? WHERE restaurantID=?";
  const values = [
    req.body.name,
    req.body.address,
    req.body.phone,
    req.body.rating,
    id,
  ];
  db.query(sql, values, (err) => {
    if (err) {
      console.error("Error executing query:", err);
      return res.status(500).json({ message: "Server error" });
    }
    res.json({ success: "Restaurant updated successfully" });
  });
});

app.delete("/delete_restaurant/:id", (req, res) => {
  const {id} = req.params;
  const sql = "DELETE FROM restaurant WHERE restaurantID = ?";
  db.query(sql, [id], (err) => {
    if (err) {
      console.error("Error executing query:", err);
      return res.status(500).json({ message: "Server error" });
    }
    res.json({ success: "Restaurant deleted successfully" });
  });
});

// MENU
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

app.get("/get_menu/:name", (req, res) => {
  const {name} = req.params;
  const sql = `
    SELECT m.*
    FROM menuitem m
    JOIN restaurant r ON m.restaurantID = r.restaurantID
    WHERE r.name = ?`;
  db.query(sql, [name], (err, result) => {
    if (err) {
      console.error("Error executing query:", err);
      return res.status(500).json({ message: "Server error" });
    }
    res.json(result);
  });
});

app.get("/get_menuitem/:id", (req, res) => {
  const {id} = req.params;
  const sql = `
    SELECT *
    FROM menuitem
    WHERE menuitemID = ?`;
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error("Error executing query:", err);
      return res.status(500).json({ message: "Server error" });
    }
    res.json(result);
  });
});

app.post("/add_menuitem", (req, res) => {
  const { menuitemID, name, price, description, restaurantID } = req.body;
  const sql =
    "INSERT INTO menuitem (menuitemID, name, price, description, restaurantID) VALUES (?, ?, ?, ?, ?)";
  db.query(sql, [menuitemID, name, price, description, restaurantID], (err) => {
    if (err) {
      console.error("Error executing query:", err);
      return res.status(500).json({ message: "Server error" });
    }
    res.json({ success: "Menu item added successfully!" });
  });
});

app.post("/edit_menuitem/:id", (req, res) => {
  const {id} = req.params;
  const sql =
    "UPDATE menuitem SET name=?, price=?, description=?, restaurantID=? WHERE menuitemID=?";
  const values = [
    req.body.name,
    req.body.price,
    req.body.description,
    req.body.restaurantID,
    id,
  ];
  db.query(sql, values, (err) => {
    if (err) {
      console.error("Error executing query:", err);
      return res.status(500).json({ message: "Server error" });
    }
    res.json({ success: "Menu item updated successfully" });
  });
});

app.delete("/delete_menuitem/:id", (req, res) => {
  const {id} = req.params;
  const sql = "DELETE FROM menuitem WHERE menuitemID = ?";
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error("Error executing query:", err);
      return res.status(500).json({ message: "Server error" });
    }
    res.json({ success: "Menu item deleted successfully" });
  });
});

// CUSTOMERS
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

app.get("/get_customer_name/:id", (req, res) => {
  const {id} = req.params;
  const sql = "SELECT name FROM customer WHERE customerID = ?";
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error("Error executing query:", err);
      return res.status(500).json({ message: "Server error" });
    }
    res.json(result);
  });
});

app.get("/get_customer/:name", (req, res) => {
  const { name } = req.params;
  const sql = "SELECT * FROM customer WHERE name = ?";
  db.query(sql, [name], (err, result) => {
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
  const { customerID, name, email, phone, address } = req.body;
  const sql = "INSERT INTO customer (customerID, name, email, phone, address) VALUES (?, ?, ?, ?, ?)";
  db.query(sql, [customerID, name, email, phone, address], (err) => {
    if (err) {
      console.error("Error executing query:", err);
      return res.status(500).json({ message: "Server error" });
    }
    res.json({ message: "Customer added successfully" });
  });
});

app.post("/edit_customer/:id", (req, res) => {
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

// CUSTOMER ORDERS
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

// customer orders from a customers
app.get("/get_customerorders/:id", (req, res) => {
  const {id} = req.params;
  const sql = `SELECT 
  co.customerorderID,
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
    co.customerID = ?;`
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error("Error executing query:", err);
      return res.status(500).json({ message: "Server error" });
    }
    res.json(result);
  });
});

// get a customer order
app.get("/get_customerorder/:id", (req, res) => {
  const {id} = req.params;
  const sql = `SELECT * FROM customerOrder WHERE customerorderID = ?;`
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error("Error executing query:", err);
      return res.status(500).json({ message: "Server error" });
    }
    res.json(result);
  });
});

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

  const orderSql = "INSERT INTO customerorder (customerorderID, customerID, restaurantID, date, paymentStatus, deliveryStatus) VALUES (?, ?, ?, ?, ?, ?)";

  db.query(orderSql, [customerorderID, customerID, restaurantID, date, paymentStatus, deliveryStatus], (err) => {
    if (err) {
      console.error("Error executing query:", err);
      return res.status(500).json({ message: "Error inserting into Customer Order" });
    }

    const itemSql = "INSERT INTO customerorderitem (customerorderID, menuitemID, quantity) VALUES ?";
    const orderItems = items.map(item => [customerorderID, item.menuitemID, item.quantity]);

    db.query(itemSql, [orderItems], (err) => {
      if (err) {
        console.error("Error executing query:", err);
        return res.status(500).json({ message: "Error inserting into Customer Order Item" });
      }

      res.json({ success: "Order and items added successfully!" });
    });
  });
});

app.post("/edit_customerorder/:id", (req, res) => {
  const {id} = req.params;
  const { customerID, restaurantID, date, paymentStatus, deliveryStatus } = req.body;  
  const sql =
    "UPDATE customerorder SET customerID=?, restaurantID=?, date=?, paymentStatus=?, deliveryStatus=? WHERE customerorderID=?";
  db.query(sql, [
    customerID,
    restaurantID,
    date,
    paymentStatus,
    deliveryStatus,
    id,
  ], (err) => {
    if (err) {
      console.error("Error executing query:", err);
      return res.status(500).json({ message: "Server error" });
    }
    res.json({ success: "Customer order updated successfully" });
  });
});

app.delete("/delete_customerorder/:id", (req, res) => {
  const { id } = req.params;
  const deleteCustomerOrderItemSQL = "DELETE FROM customerorderitem WHERE customerorderID = ?";

  db.query(deleteCustomerOrderItemSQL, [id], (err) => {
    if (err) {
      console.error("Error executing query:", err);
      res.status(500).json({ message: "Server error" });
    }

    const deleteCustomerOrderSQL = "DELETE FROM customerorder WHERE customerorderID = ?";

    db.query(deleteCustomerOrderSQL, [id], (err) => {
      if (err) {
          console.error("Error executing query:", err);
          res.status(500).json({ message: "Server error" });
      }

      res.json({ success: "Customer order deleted successfully" });
    });
  });
});

// CUSTOMER ORDER ITEMS
app.get("/customerorderitems/:id", (req, res) => {
  const { id } = req.params;
  const sql = `SELECT * FROM customerorderitem WHERE customerorderID = ?;`;
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error("Error executing query:", err);
      return res.status(500).json({ message: "Server error" });
    }
    res.json(result);
  });
});

app.post("/add_customerorderitem", (req, res) => {
  const {
    customerorderID,
    menuitemID,
    quantity
  } = req.body;
  const sql =
    "INSERT INTO customerorderitem (customerorderID, menuitemID, quantity) VALUES (?, ?, ?)";
  const values = [customerorderID, menuitemID, quantity];
  db.query(sql, values, (err) => {
    if (err) {
      console.error("Error executing query:", err);
      return res.status(500).json({ message: "Server error" });
    }
    res.json({ success: "Customer order item added successfully!" });
  });
});

app.post("/edit_customerorderitem/:id", (req, res) => {
  const { id } = req.params;
  const { menuitemID, quantity, customerorderID } = req.body;
  const sql =
    "UPDATE customerorderitem SET menuitemID = ?, quantity = ? WHERE customerorderID = ? AND menuitemID = ?";
  const values = [menuitemID, quantity, customerorderID, id];
  
  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("Error executing query:", err);
      return res.status(500).json({ message: "Server error" });
    }
    console.log("Customer order item updated successfully!");
    res.status(200).json({ message: "Customer order item updated successfully!" });
  });
});

app.delete("/delete_customerorderitem/:orderId/:itemId", (req, res) => {
  const { orderId, itemId } = req.params;
  const sql = "DELETE FROM customerOrderItem WHERE customerOrderID = ? AND menuItemID = ?";
  db.query(sql, [orderId, itemId], (err) => {
    if (err) {
      console.error("Error executing query:", err);
      return res.status(500).json({ message: "Server error" });
    }
    res.json({ success: "Customer order item deleted successfully!" });
  });
});