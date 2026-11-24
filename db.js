const { Pool } = require("pg");
require("dotenv").config();

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL is missing. Copy .env.example to .env and configure PostgreSQL."
  );
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // Render PostgreSQL connections use SSL. Local development can use NODE_ENV=development.
  ssl: process.env.NODE_ENV === "production"
    ? { rejectUnauthorized: false }
    : false
});

pool.on("error", (error) => {
  console.error("Unexpected PostgreSQL pool error:", error.message);
});

module.exports = pool;
