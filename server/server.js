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

app.get("/", (req, res) => { res.send("Welcome to the Restaurant API!"); });

app.get("/customers", (req, res) => {
  const sql = "SELECT * FROM customer";
  db.query(sql, (err, result) => {
    if (err) res.json({ message: "Server error" });
    return res.json(result);
  });
});

app.get("/employees", (req, res) => {
  const sql = "SELECT * FROM employee";
  db.query(sql, (err, result) => {
    if (err) res.json({ message: "Server error" });
    return res.json(result);
  });
});

app.get("/inventory", (req, res) => {
  const sql = "SELECT * FROM inventory";
  db.query(sql, (err, result) => {
    if (err) res.json({ message: "Server error" });
    return res.json(result);
  });
});

app.get("/orders", (req, res) => {
  const sql = "SELECT * FROM order";
  db.query(sql, (err, result) => {
    if (err) res.json({ message: "Server error" });
    return res.json(result);
  });
});

app.get("/restaurants", (req, res) => {
  const sql = "SELECT * FROM restaurant";
  db.query(sql, (err, result) => {
    if (err) res.json({ message: "Server error" });
    return res.json(result);
  });
});

app.get("/suppliers", (req, res) => {
  const sql = "SELECT * FROM supplier";
  db.query(sql, (err, result) => {
    if (err) res.json({ message: "Server error" });
    return res.json(result);
  });
});

app.post("/add_customer", (req, res) => {
  const sql =
    "INSERT INTO `customer` (firstname, middlename, lastname, mobile, email, address, passwordHash) VALUES (?, ?, ?, ?)";
  const values = [req.body.firstname, req.body.middlename, req.body.lastname, req.body.mobile, req.body.email, req.body.address, req.body.passwordHash];
  db.query(sql, values, (err, result) => {
    if (err)
      return res.json({ message: "Something unexpected has occured" + err });
    return res.json({ success: "Student added successfully" });
  });
});

app.get("/get_customer/:id", (req, res) => {
  const id = req.params.id;
  const sql = "SELECT * FROM customer WHERE `id`= ?";
  db.query(sql, [id], (err, result) => {
    if (err) res.json({ message: "Server error" });
    return res.json(result);
  });
});

app.post("/edit_customer/:id", (req, res) => {
  const id = req.params.id;
  const sql =
    "UPDATE customer SET `firstname`=?,  `middlename`=?, `lastname`=?, `mobile`=?, `email`=?, `address`=?, `passwordHash`=? WHERE id=?";
  const values = [
    req.body.name,
    req.body.email,
    req.body.age,
    req.body.gender,
    id,
  ];
  db.query(sql, values, (err, result) => {
    if (err)
      return res.json({ message: "Something unexpected has occured" + err });
    return res.json({ success: "Student updated successfully" });
  });
});

app.delete("/delete_customer/:id", (req, res) => {
  const id = req.params.id;
  const sql = "DELETE FROM customer WHERE id=?";
  const values = [id];
  db.query(sql, values, (err, result) => {
    if (err)
      return res.json({ message: "Something unexpected has occured" + err });
    return res.json({ success: "Student deleted successfully" });
  });
});

app.listen(port, () => {
  console.log(`listening on port ${port} `);
}); 