const express = require("express");
const mysql = require("mysql");
const cors = require("cors"); 
const path = require("path");
const app = express();
//path.resolve()
app.use(express.static(path.join(__dirname, "public")));
app.use(cors());
app.use(express.json());

const port = 5000;
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "mariahphpMyAdmin",
  database: "bonappetit",
});

app.get("/", (req, res) => { res.send("Welcome to the BonAppetit API!"); });

// restaurants
app.get("/restaurants", (req, res) => {
  const sql = "SELECT * FROM restaurant";
  db.query(sql, (err, result) => {
    if (err) res.json({ message: "Server error" });
    return res.json(result);
  });
});

app.post("/add_restaurant", (req, res) => {
  const sql =
    "INSERT INTO restaurant (restaurantID, name, address, phone, rating) VALUES (?, ?, ?, ?, ?)";
  const values = [req.body.restaurantID, req.body.name, req.body.address, req.body.phone, req.body.rating];
  db.query(sql, values, (err, result) => {
    if (err)
      return res.json({ message: "Something unexpected has occurred: " + err });
    return res.json({ success: "Restaurant added successfully!" });
  });
});

app.get("/get_restaurant/:id", (req, res) => {
  const id = req.params.id;
  const sql = "SELECT * FROM restaurant WHERE restaurantID = ?";
  db.query(sql, [id], (err, result) => {
    if (err) res.json({ message: "Server error" });
    return res.json(result);
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
    if (err)
      return res.json({ message: "Something unexpected has occurred" + err });
    return res.json({ success: "Restaurant updated successfully" });
  });
});

app.delete("/delete_restaurant/:id", (req, res) => {
  const id = req.params.id;
  const sql = "DELETE FROM restaurant WHERE restaurantID = ?";
  db.query(sql, [id], (err, result) => {
    if (err)
      return res.json({ message: "Something unexpected has occurred" + err });
    return res.json({ success: "Restaurant deleted successfully" });
  });
});

// menuItem
app.get("/menuitems", (req, res) => {
  const sql = "SELECT * FROM menuitem";
  db.query(sql, (err, result) => {
    if (err) res.json({ message: "Server error" });
    return res.json(result);
  });
});

app.get("/get_menu/:restaurantID", (req, res) => {
  const restaurantID = req.params.restaurantID; // Extract restaurantID from the request parameters
  const sql = "SELECT * FROM menuItem WHERE restaurantID = ?";
  db.query(sql, [restaurantID], (err, result) => {
    if (err) {
      console.error("Error executing query:", err); // Log the error
      return res.status(500).json({ message: "Server error" });
    }
    return res.json(result);
  });
});

app.post("/add_menuitem", (req, res) => {
  const sql =
    "INSERT INTO menuItem (menuitemID, name, price, description, restaurantID) VALUES (?, ?, ?, ?, ?)";
  const values = [req.body.menuitemID, req.body.name, req.body.price, req.body.description, req.body.restaurantID];
  db.query(sql, values, (err, result) => {
    if (err)
      return res.json({ message: "Something unexpected has occurred: " + err });
    return res.json({ success: "Menu item added successfully!" });
  });
});

app.get("/get_menuitem/:id", (req, res) => {
  const id = req.params.id;
  const sql = "SELECT * FROM menuItem WHERE menuitemID = ?";
  db.query(sql, [id], (err, result) => {
    if (err) res.json({ message: "Server error" });
    return res.json(result);
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
    if (err)
      return res.json({ message: "Something unexpected has occurred" + err });
    return res.json({ success: "Menu item updated successfully" });
  });
});

app.delete("/delete_menuitem/:id", (req, res) => {
  const id = req.params.id;
  const sql = "DELETE FROM menuItem WHERE menuitemID = ?";
  db.query(sql, [id], (err, result) => {
    if (err)
      return res.json({ message: "Something unexpected has occurred" + err });
    return res.json({ success: "Menu item deleted successfully" });
  });
});

// employee
app.get("/employees", (req, res) => {
  const sql = "SELECT * FROM employee";
  db.query(sql, (err, result) => {
    if (err) res.json({ message: "Server error" });
    return res.json(result);
  });
});

app.post("/add_employee", (req, res) => {
  const sql =
    "INSERT INTO employee (employeeID, name, role, phone, address, salary, restaurantID) VALUES (?, ?, ?, ?, ?, ?, ?)";
  const values = [req.body.employeeID, req.body.name, req.body.role, req.body.phone, req.body.address, req.body.salary, req.body.restaurantID];
  db.query(sql, values, (err, result) => {
    if (err)
      return res.json({ message: "Something unexpected has occurred: " + err });
    return res.json({ success: "Employee added successfully!" });
  });
});

app.get("/get_employee/:id", (req, res) => {
  const id = req.params.id;
  const sql = "SELECT * FROM employee WHERE employeeID = ?";
  db.query(sql, [id], (err, result) => {
    if (err) res.json({ message: "Server error" });
    return res.json(result);
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
    if (err)
      return res.json({ message: "Something unexpected has occurred" + err });
    return res.json({ success: "Employee updated successfully" });
  });
});

app.delete("/delete_employee/:id", (req, res) => {
  const id = req.params.id;
  const sql = "DELETE FROM employee WHERE employeeID = ?";
  db.query(sql, [id], (err, result) => {
    if (err)
      return res.json({ message: "Something unexpected has occurred" + err });
    return res.json({ success: "Employee deleted successfully" });
  });
});

// supplier
app.get("/suppliers", (req, res) => {
  const sql = "SELECT * FROM supplier";
  db.query(sql, (err, result) => {
    if (err) res.json({ message: "Server error" });
    return res.json(result);
  });
});

app.post("/add_supplier", (req, res) => {
  const sql =
    "INSERT INTO supplier (supplierID, name, contactperson, phone, address) VALUES (?, ?, ?, ?, ?)";
  const values = [req.body.supplierID, req.body.name, req.body.contactperson, req.body.phone, req.body.address];
  db.query(sql, values, (err, result) => {
    if (err)
      return res.json({ message: "Something unexpected has occurred: " + err });
    return res.json({ success: "Supplier added successfully!" });
  });
});

app.get("/get_supplier/:id", (req, res) => {
  const id = req.params.id;
  const sql = "SELECT * FROM supplier WHERE supplierID = ?";
  db.query(sql, [id], (err, result) => {
    if (err) res.json({ message: "Server error" });
    return res.json(result);
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
    if (err)
      return res.json({ message: "Something unexpected has occurred" + err });
    return res.json({ success: "Supplier updated successfully" });
  });
});

app.delete("/delete_supplier/:id", (req, res) => {
  const id = req.params.id;
  const sql = "DELETE FROM supplier WHERE supplierID = ?";
  db.query(sql, [id], (err, result) => {
    if (err)
      return res.json({ message: "Something unexpected has occurred" + err });
    return res.json({ success: "Supplier deleted successfully" });
  });
});

// inventory
app.get("/inventory", (req, res) => {
  const sql = "SELECT * FROM inventory";
  db.query(sql, (err, result) => {
    if (err) res.json({ message: "Server error" });
    return res.json(result);
  });
});

app.post("/add_inventory", (req, res) => {
  const sql =
    "INSERT INTO inventory (inventoryID, name, quantity, unitPrice, restaurantID, supplierID) VALUES (?, ?, ?, ?, ?, ?)";
  const values = [req.body.inventoryID, req.body.name, req.body.quantity, req.body.unitPrice, req.body.restaurantID, req.body.supplierID];
  db.query(sql, values, (err, result) => {
    if (err)
      return res.json({ message: "Something unexpected has occurred: " + err });
    return res.json({ success: "Inventory added successfully!" });
  });
});

app.get("/get_inventory/:id", (req, res) => {
  const id = req.params.id;
  const sql = "SELECT * FROM inventory WHERE inventoryID = ?";
  db.query(sql, [id], (err, result) => {
    if (err) res.json({ message: "Server error" });
    return res.json(result);
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
    if (err)
      return res.json({ message: "Something unexpected has occurred" + err });
    return res.json({ success: "Inventory updated successfully" });
  });
});

app.delete("/delete_inventory/:id", (req, res) => {
  const id = req.params.id;
  const sql = "DELETE FROM inventory WHERE inventoryID = ?";
  db.query(sql, [id], (err, result) => {
    if (err)
      return res.json({ message: "Something unexpected has occurred" + err });
    return res.json({ success: "Inventory deleted successfully" });
  });
});

// inventoryOrder
app.get("/inventoryorders", (req, res) => {
  const sql = "SELECT * FROM inventoryOrder";
  db.query(sql, (err, result) => {
    if (err) res.json({ message: "Server error" });
    return res.json(result);
  });
});

app.post("/add_inventoryorder", (req, res) => {
  const sql =
    "INSERT INTO inventoryOrder (inventoryOrderID, supplierID, employeeID, restaurantID, date, paymentStatus, deliveryStatus) VALUES (?, ?, ?, ?, ?, ?, ?)";
  const values = [req.body.inventoryOrderID, req.body.supplierID, req.body.employeeID, req.body.restaurantID, req.body.date, req.body.paymentStatus, req.body.deliveryStatus];
  db.query(sql, values, (err, result) => {
    if (err)
      return res.json({ message: "Something unexpected has occurred: " + err });
    return res.json({ success: "Inventory order added successfully!" });
  });
});

app.get("/get_inventoryorder/:id", (req, res) => {
  const id = req.params.id;
  const sql = "SELECT * FROM inventoryOrder WHERE inventoryOrderID = ?";
  db.query(sql, [id], (err, result) => {
    if (err) res.json({ message: "Server error" });
    return res.json(result);
  });
});

app.post("/edit_inventoryorder/:id", (req, res) => {
  const id = req.params.id;
  const sql =
    "UPDATE inventoryOrder SET supplierID=?, employeeID=?, restaurantID=?, date=?, paymentStatus=?, deliveryStatus=? WHERE inventoryOrderID=?";
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
    if (err)
      return res.json({ message: "Something unexpected has occurred" + err });
    return res.json({ success: "Inventory order updated successfully" });
  });
});

app.delete("/delete_inventoryorder/:id", (req, res) => {
  const id = req.params.id;
  const sql = "DELETE FROM inventoryOrder WHERE inventoryOrderID = ?";
  db.query(sql, [id], (err, result) => {
    if (err)
      return res.json({ message: "Something unexpected has occurred" + err });
    return res.json({ success: "Inventory order deleted successfully" });
  });
});

// inventoryorderItem
app.get("/inventory_order_items", (req, res) => {
  const sql = "SELECT * FROM inventoryOrderItem";
  db.query(sql, (err, result) => {
    if (err) res.json({ message: "Server error" });
    return res.json(result);
  });
});

app.post("/add_inventory_order_item", (req, res) => {
  const sql =
    "INSERT INTO inventoryOrderItem (inventoryOrderID, inventoryID, quantity, unitPrice) VALUES (?, ?, ?, ?)";
  const values = [req.body.inventoryOrderID, req.body.inventoryID, req.body.quantity, req.body.unitPrice];
  db.query(sql, values, (err, result) => {
    if (err)
      return res.json({ message: "Something unexpected has occurred: " + err });
    return res.json({ success: "Inventory order item added successfully!" });
  });
});

app.get("/get_inventory_order_item/:id", (req, res) => {
  const { inventoryOrderID, inventoryID } = req.params;
  const sql = "SELECT * FROM inventoryOrderItem WHERE inventoryOrderID = ? AND inventoryID = ?";
  db.query(sql, [inventoryOrderID, inventoryID], (err, result) => {
    if (err) res.json({ message: "Server error" });
    return res.json(result);
  });
});

app.post("/edit_inventory_order_item", (req, res) => {
  const { inventoryOrderID, inventoryID } = req.params;
  const sql =
    "UPDATE inventoryOrderItem SET quantity=?, unitPrice=? WHERE inventoryOrderID=? AND inventoryID=?";
  const values = [
    req.body.quantity,
    req.body.unitPrice,
    inventoryOrderID,
    inventoryID,
  ];
  db.query(sql, values, (err, result) => {
    if (err)
      return res.json({ message: "Something unexpected has occurred" + err });
    return res.json({ success: "Inventory order item updated successfully" });
  });
});

app.delete("/delete_inventory_order_item", (req, res) => {
  const { inventoryOrderID, inventoryID } = req.params;
  const sql = "DELETE FROM inventoryOrderItem WHERE inventoryOrderID = ? AND inventoryID = ?";
  db.query(sql, [inventoryOrderID, inventoryID], (err, result) => {
    if (err)
      return res.json({ message: "Something unexpected has occurred" + err });
    return res.json({ success: "Inventory order item deleted successfully" });
  });
});

// customer
app.get("/customers", (req, res) => {
  const sql = "SELECT * FROM customer";
  db.query(sql, (err, result) => {
    if (err) res.json({ message: "Server error" });
    return res.json(result);
  });
});

app.post("/add_customer", (req, res) => {
  const sql =
    "INSERT INTO customer (customerID, name, email, phone, address) VALUES (?, ?, ?, ?, ?)";
  const values = [req.body.customerID, req.body.name, req.body.email, req.body.phone, req.body.address];
  db.query(sql, values, (err, result) => {
    if (err)
      return res.json({ message: "Something unexpected has occurred: " + err });
    return res.json({ success: "Customer added successfully!" });
  });
});

app.get("/get_customer/:id", (req, res) => {
  const id = req.params.id;
  const sql = "SELECT * FROM customer WHERE customerID = ?";
  db.query(sql, [id], (err, result) => {
    if (err) res.json({ message: "Server error" });
    return res.json(result);
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
    if (err)
      return res.json({ message: "Something unexpected has occurred" + err });
    return res.json({ success: "Customer updated successfully" });
  });
});

app.delete("/delete_customer/:id", (req, res) => {
  const id = req.params.id;
  const sql = "DELETE FROM customer WHERE customerID = ?";
  db.query(sql, [id], (err, result) => {
    if (err)
      return res.json({ message: "Something unexpected has occurred" + err });
    return res.json({ success: "Customer deleted successfully" });
  });
});

// customerOrder
app.get("/customer_orders", (req, res) => {
  const sql = "SELECT * FROM customerOrder";
  db.query(sql, (err, result) => {
    if (err) res.json({ message: "Server error" });
    return res.json(result);
  });
});

app.post("/add_customer_order", (req, res) => {
  const sql =
    "INSERT INTO customerOrder (customerorderID, customerID, restaurantID, date, paymentStatus, deliveryStatus) VALUES (?, ?, ?, ?, ?, ?)";
  const values = [req.body.customerorderID, req.body.customerID, req.body.restaurantID, req.body.date, req.body.paymentStatus, req.body.deliveryStatus];
  db.query(sql, values, (err, result) => {
    if (err)
      return res.json({ message: "Something unexpected has occurred: " + err });
    return res.json({ success: "Customer order added successfully!" });
  });
});

app.get("/get_customer_order/:id", (req, res) => {
  const id = req.params.id;
  const sql = "SELECT * FROM customerOrder WHERE customerorderID = ?";
  db.query(sql, [id], (err, result) => {
    if (err) res.json({ message: "Server error" });
    return res.json(result);
  });
});

app.post("/edit_customer_order/:id", (req, res) => {
  const id = req.params.id;
  const sql =
    "UPDATE customerOrder SET customerID=?, restaurantID=?, date=?, paymentStatus=?, deliveryStatus=? WHERE customerorderID=?";
  const values = [
    req.body.customerID,
    req.body.restaurantID,
    req.body.date,
    req.body.paymentStatus,
    req.body.deliveryStatus,
    id,
  ];
  db.query(sql, values, (err, result) => {
    if (err)
      return res.json({ message: "Something unexpected has occurred" + err });
    return res.json({ success: "Customer order updated successfully" });
  });
});

app.delete("/delete_customer_order/:id", (req, res) => {
  const id = req.params.id;
  const sql = "DELETE FROM customerOrder WHERE customerorderID = ?";
  db.query(sql, [id], (err, result) => {
    if (err)
      return res.json({ message: "Something unexpected has occurred" + err });
    return res.json({ success: "Customer order deleted successfully" });
  });
});

// customerOrderitem
app.get("/customer_order_items", (req, res) => {
  const sql = "SELECT * FROM customerOrderItem";
  db.query(sql, (err, result) => {
    if (err) res.json({ message: "Server error" });
    return res.json(result);
  });
});

app.post("/add_customer_order_item", (req, res) => {
  const sql =
    "INSERT INTO customerOrderItem (customerOrderID, menuItemID) VALUES (?, ?)";
  const values = [req.body.customerOrderID, req.body.menuItemID];
  db.query(sql, values, (err, result) => {
    if (err)
      return res.json({ message: "Something unexpected has occurred: " + err });
    return res.json({ success: "Customer order item added successfully!" });
  });
});

app.get("/get_customer_order_item/:orderId/:itemId", (req, res) => {
  const { orderId, itemId } = req.params;
  const sql = "SELECT * FROM customerOrderItem WHERE customerOrderID = ? AND menuItemID = ?";
  db.query(sql, [orderId, itemId], (err, result) => {
    if (err) res.json({ message: "Server error" });
    return res.json(result);
  });
});

app.post("/edit_customer_order_item/:orderId/:itemId", (req, res) => {
  const { orderId, itemId } = req.params;
  const sql =
    "UPDATE customerOrderItem SET menuItemID=? WHERE customerOrderID = ? AND menuItemID = ?";
  const values = [
    req.body.menuItemID,
    orderId,
    itemId,
  ];
  db.query(sql, values, (err, result) => {
    if (err)
      return res.json({ message: "Something unexpected has occurred" + err });
    return res.json({ success: "Customer order item updated successfully!" });
  });
});

app.delete("/delete_customer_order_item/:orderId/:itemId", (req, res) => {
  const { orderId, itemId } = req.params;
  const sql = "DELETE FROM customerOrderItem WHERE customerOrderID = ? AND menuItemID = ?";
  db.query(sql, [orderId, itemId], (err, result) => {
    if (err)
      return res.json({ message: "Something unexpected has occurred" + err });
    return res.json({ success: "Customer order item deleted successfully!" });
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
    if (err) res.json({ message: "Server error" });
    return res.json(result);
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
    if (err) res.json({ message: "Server error" });
    return res.json(result);
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
    if (err) res.json({ message: "Server error" });
    return res.json(result);
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
    if (err) res.json({ message: "Server error" });
    return res.json(result);
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
    if (err) res.json({ message: "Server error" });
    return res.json(result);
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
    if (err) res.json({ message: "Server error" });
    return res.json(result);
  });
});

app.get("/total_sales", (req, res) => {
  const sql = `
  SELECT ROUND(SUM(c.quantity * m.price), 2) AS total_sales
  FROM customerOrderItem c
  JOIN menuItem m ON c.menuItemID = m.menuItemID;
  `;
  db.query(sql, (err, result) => {
    if (err) res.json({ message: "Server error" });
    return res.json(result);
  });
});

app.get("/total_profit", (req, res)=>{
  const sql = `
  SELECT ROUND(total_sales - (total_inventory_expenses + total_salary_expenses), 2) AS total_profit
  FROM (
      SELECT
          (SELECT SUM(oi.quantity * m.price)
          FROM customerOrderItem oi
          JOIN menuItem m ON oi.menuItemID = m.menuItemID) AS total_sales,
          (SELECT SUM(ioi.quantity * ioi.unitPrice)
          FROM inventoryOrderItem ioi
          JOIN inventoryOrder io ON ioi.inventoryOrderID = io.inventoryOrderID) AS total_inventory_expenses,
          (SELECT SUM(salary)
          FROM employee) AS total_salary_expenses
  ) AS derived;
  `;
  db.query(sql, (err, result) => {
    if (err) res.json({ message: "Server error" });
    return res.json(result);
  });
})

app.get("/avg_rating", (req, res)=>{
  const sql = `
  SELECT ROUND(AVG(rating), 2) AS average_rating
  FROM restaurant;
  `;
  db.query(sql, (err, result) => {
    if (err) res.json({ message: "Server error" });
    return res.json(result);
  });
})

app.listen(port, () => {
  console.log(`listening on port ${port} `);
}); 