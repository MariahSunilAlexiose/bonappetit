# BonAppetit

BonAppetit is a comprehensive restaurant management system that streamlines various aspects of restaurant operations, including customer management, menu management, employee management, inventory tracking, and order processing. This project is built using a modern tech stack with a ReactJS frontend and a PHPMyAdmin MySQL backend.

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

```
git clone https://github.com/MariahSunilAlexiose/bonappetit.git
cd bonappetit
```

2. Install dependencies for client

```
cd client
yarn
```

3. Install dependencies for server

```
cd server
yarn
```

4. Add the env variables for the server

```
PORT=8080
DB_HOST=localhost
DB_USER=
DB_PASSWORD=
DB_DATABASE=bonappetit
```
