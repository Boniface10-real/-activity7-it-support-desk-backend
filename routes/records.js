const express = require("express");
const pool = require("../db");

const router = express.Router();
const VALID_STATUSES = ["Pending", "In progress", "Completed"];

function parseRecordId(value) {
  if (!/^[1-9]\d*$/.test(value)) return null;
  const id = Number(value);
  return Number.isSafeInteger(id) ? id : null;
}

function validateRecord(body) {
  const fields = ["title", "category", "description", "status"];
  const errors = [];

  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return { errors: ["Request body must be a JSON object."] };
  }

  for (const field of fields) {
    if (typeof body[field] !== "string") {
      errors.push(`${field} must be a string.`);
    }
  }

  if (errors.length) return { errors };

  const record = {
    title: body.title.trim(),
    category: body.category.trim(),
    description: body.description.trim(),
    status: body.status.trim()
  };

  if (record.title.length < 3 || record.title.length > 80) {
    errors.push("title must contain 3 to 80 characters.");
  }
  if (record.category.length < 2 || record.category.length > 40) {
    errors.push("category must contain 2 to 40 characters.");
  }
  if (record.description.length < 5 || record.description.length > 300) {
    errors.push("description must contain 5 to 300 characters.");
  }
  if (!VALID_STATUSES.includes(record.status)) {
    errors.push("status must be Pending, In progress, or Completed.");
  }

  return { record, errors };
}

// GET /api/records - return all records (an empty array if there are none).
router.get("/", async (req, res, next) => {
  try {
    const result = await pool.query(
      "SELECT id, title, category, description, status FROM records ORDER BY id ASC"
    );
    res.status(200).json(result.rows);
  } catch (error) {
    next(error);
  }
});

// GET /api/records/:id - return one record.
router.get("/:id", async (req, res, next) => {
  const id = parseRecordId(req.params.id);
  if (!id) return res.status(400).json({ message: "id must be a positive whole number." });

  try {
    const result = await pool.query(
      "SELECT id, title, category, description, status FROM records WHERE id = $1",
      [id]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Record not found." });
    }
    return res.status(200).json(result.rows[0]);
  } catch (error) {
    return next(error);
  }
});

// POST /api/records - create a record. Any client-supplied id is ignored.
router.post("/", async (req, res, next) => {
  const { record, errors } = validateRecord(req.body);
  if (errors.length) return res.status(400).json({ message: errors.join(" ") });

  try {
    const result = await pool.query(
      `INSERT INTO records (title, category, description, status)
       VALUES ($1, $2, $3, $4)
       RETURNING id, title, category, description, status`,
      [record.title, record.category, record.description, record.status]
    );
    return res.status(201).json(result.rows[0]);
  } catch (error) {
    return next(error);
  }
});

// PUT /api/records/:id - replace all editable fields; never creates a missing row.
router.put("/:id", async (req, res, next) => {
  const id = parseRecordId(req.params.id);
  if (!id) return res.status(400).json({ message: "id must be a positive whole number." });

  const { record, errors } = validateRecord(req.body);
  if (errors.length) return res.status(400).json({ message: errors.join(" ") });

  try {
    const result = await pool.query(
      `UPDATE records
       SET title = $1, category = $2, description = $3, status = $4
       WHERE id = $5
       RETURNING id, title, category, description, status`,
      [record.title, record.category, record.description, record.status, id]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Record not found." });
    }
    return res.status(200).json(result.rows[0]);
  } catch (error) {
    return next(error);
  }
});

// DELETE /api/records/:id - delete an existing record.
router.delete("/:id", async (req, res, next) => {
  const id = parseRecordId(req.params.id);
  if (!id) return res.status(400).json({ message: "id must be a positive whole number." });

  try {
    const result = await pool.query(
      "DELETE FROM records WHERE id = $1 RETURNING id",
      [id]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Record not found." });
    }
    return res.status(200).json({ message: "Record deleted." });
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
