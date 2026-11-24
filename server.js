require("dotenv").config();

const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const pool = require("./db");
const recordsRouter = require("./routes/records");

const app = express();
const PORT = process.env.PORT || 3000;

const allowedOrigins = (process.env.CLIENT_ORIGINS || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(cors(
  allowedOrigins.length
    ? { origin: allowedOrigins }
    : {}
));
app.use(express.json());

async function initializeDatabase() {
  const schema = fs.readFileSync(path.join(__dirname, "schema.sql"), "utf8");
  const seed = fs.readFileSync(path.join(__dirname, "seed.sql"), "utf8");

  await pool.query(schema);
  await pool.query(seed);
  console.log("Database schema checked and sample data ensured.");
}

app.get("/", (req, res) => {
  const baseUrl = process.env.PUBLIC_BASE_URL || `${req.protocol}://${req.get("host")}`;
  res.status(200).json({
    project: "ICT251 Activity 7 - IT Support Desk API",
    studentNumber: process.env.STUDENT_NUMBER || "Add your student number in .env",
    description: "A REST API for creating, viewing, updating and deleting IT support records.",
    baseUrl,
    health: `${baseUrl}/health`,
    records: `${baseUrl}/api/records`,
    routes: [
      { method: "GET", path: "/", purpose: "Display this API guide" },
      { method: "GET", path: "/health", purpose: "Check API and database connection" },
      { method: "GET", path: "/api/records", purpose: "List all records" },
      { method: "GET", path: "/api/records/:id", purpose: "Get one record" },
      { method: "POST", path: "/api/records", purpose: "Create a record" },
      { method: "PUT", path: "/api/records/:id", purpose: "Replace all editable fields of a record" },
      { method: "DELETE", path: "/api/records/:id", purpose: "Delete a record" }
    ],
    fields: {
      title: "String, 3-80 characters",
      category: "String, 2-40 characters",
      description: "String, 5-300 characters",
      status: ["Pending", "In progress", "Completed"]
    },
    exampleBody: {
      title: "Cannot connect to campus Wi-Fi",
      category: "Network",
      description: "My laptop cannot connect to the campus wireless network.",
      status: "Pending"
    },
    responseCodes: {
      "200": "Successful GET, PUT or DELETE",
      "201": "Record created",
      "400": "Invalid input, invalid ID or malformed JSON",
      "404": "Record or route not found",
      "500": "Unexpected server error",
      "503": "Database health check failed"
    },
    note: "A hosted free service may take a short time to start after being idle."
  });
});

app.get("/health", async (req, res, next) => {
  try {
    await pool.query("SELECT 1");
    res.status(200).json({ status: "ok", database: "connected" });
  } catch (error) {
    console.error("Health check failed:", error.message);
    res.status(503).json({ status: "error", database: "unavailable" });
  }
});

app.use("/api/records", recordsRouter);

// Unknown routes return JSON rather than Express's default HTML page.
app.use((req, res) => {
  res.status(404).json({ message: "Route not found." });
});

// Handle malformed JSON and unexpected errors consistently.
app.use((error, req, res, next) => {
  if (error instanceof SyntaxError && error.status === 400 && "body" in error) {
    return res.status(400).json({ message: "Malformed JSON request body." });
  }

  console.error("Unexpected server error:", error.message);
  return res.status(500).json({ message: "Internal server error." });
});

initializeDatabase()
  .then(() => {
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`IT Support Desk API running on port ${PORT}`);
    });
  })
  .catch(async (error) => {
    console.error("Application startup failed:", error.message);
    await pool.end();
    process.exit(1);
  });

process.on("SIGTERM", async () => {
  await pool.end();
  process.exit(0);
});
