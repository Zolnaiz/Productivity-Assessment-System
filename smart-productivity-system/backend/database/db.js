const { Pool } = require("pg");
const dotenv = require("dotenv");

dotenv.config();

const requiredDbVars = [
  "DB_HOST",
  "DB_PORT",
  "DB_NAME",
  "DB_USER",
  "DB_PASSWORD",
];

const missingDbVars = requiredDbVars.filter(
  (name) => !process.env[name] || !process.env[name].trim()
);

if (missingDbVars.length > 0) {
  throw new Error(
    `Missing required database environment variables: ${missingDbVars.join(", ")}`
  );
}

const dbPort = Number(process.env.DB_PORT);

if (!Number.isInteger(dbPort) || dbPort <= 0) {
  throw new Error("DB_PORT must be a positive integer.");
}

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: dbPort,
});

module.exports = pool;
