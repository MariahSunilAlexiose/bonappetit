# BonAppetit
BonAppetit is a comprehensive restaurant management system that streamlines various aspects of restaurant operations, including customer management, menu management, employee management, inventory tracking, and order processing. This project is built using a modern tech stack with a ReactJS frontend and a PHPMyAdmin MySQL backend.

## Project Layout
The project is structured as follows:

### Client
The client side is built using React and provides the user interface for interacting with the system. Key features include:

- **Customer Management**: Interfaces for adding, updating, deleting, and viewing customer information.

- **Menu Management**: Interfaces for managing menu items, including adding, updating, and deleting items.

- **Employee Management**: Interfaces for managing employee details.

- **Supplier and Inventory Management**: Interfaces for tracking suppliers, inventory items, and managing inventory orders.

- **Order Processing**: Interfaces for processing and tracking customer and inventory orders.

### Server
The server side handles the backend operations and API endpoints using Node.js and Express. The main entities are:

- **restaurant**: Holds basic details about each restaurant, including its ID, name, address, phone number, and rating.
- **menuItem**: Contains information on each menu item, such as its ID, name, price, description, and associated restaurant ID.
- **employee**: Stores employee details, including their ID, name, role, phone number, address, and the restaurant they work at.
- **supplier**: Contains supplier information, including their ID, name, contact person, phone number, and address.
- **inventory**: Tracks inventory items, including their ID, name, quantity, unit price, associated restaurant ID, and supplier ID.
- **inventoryOrder**: Manages inventory orders, including order ID, supplier ID, employee ID, restaurant ID, date, payment status, and delivery status.
- **inventoryOrderItem**: Details each item in an inventory order by including the order ID, inventory item ID, quantity, and unit price.
- **customer**: Stores customer details, including their ID, name, email, phone number, and address.
- **customerOrder**: Manages customer orders with details like order ID, customer ID, restaurant ID, date, payment status, and delivery status.
- **customerOrderItem**: Details each item in a customer order by including the order ID and menu item ID.

## Tech Stack
### Client
- **React**: A JavaScript library for building user interfaces.
- **React Router DOM**: A library for managing routing in a React application.
- **TailwindCSS**: A utility-first CSS framework for rapid UI development.
- **Axios**: A promise-based HTTP client for the browser and Node.js.
- **Framer Motion**: A library to create animations in React applications.
- **ESLint**: A tool for identifying and fixing problems in JavaScript code.
- **Prettier**: An opinionated code formatter.
- **Husky**: A tool to manage Git hooks.
- **lint-staged**: A tool to run linters on staged Git files.
- **globals**: Defines a list of global variables for various JavaScript environments, helping tools like ESLint to recognize these globals and avoid false positive errors.

### Server
- **Express**: A fast, unopinionated, minimalist web framework for Node.js.
- **MySQL**: A relational database management system.
- **Cors**: A package for providing a Connect/Express middleware to enable CORS.
- **Dotenv**: A zero-dependency module that loads environment variables from a `.env` file into `process.env`.
- **Nodemon**: A tool that helps develop Node.js applications by automatically restarting the server when file changes are detected.

## Installation
1. Clone the repository
`git clone https://github.com/MariahSunilAlexiose/bonappetit.git`

`cd bonappetit`

2. Install dependencies for client
`cd client`

`yarn`

3. Install dependencies for server
`cd server` 

`yarn`

4. Add the env variables for the server

```
PORT=8080
DB_HOST=localhost
DB_USER=
DB_PASSWORD=
DB_DATABASE=bonappetit
```
