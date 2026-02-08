import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { pool } from "./db.js";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_HOST,
    credentials: true,
  })
);

app.use(express.json());

/* =========================
   GET busy hours
========================= */
app.get("/reservations/busy", async (req, res) => {
  try {
    const { date, masterId } = req.query;

    if (!date || !masterId) {
      return res
        .status(400)
        .json({ message: "date and masterId required" });
    }

    const result = await pool.query(
      `SELECT time FROM reservations
       WHERE date = $1 AND master_id = $2`,
      [date, masterId]
    );

    res.json(result.rows.map((r) => r.time));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

/* =========================
   POST reservation
========================= */
app.post("/reservations", async (req, res) => {
  try {
    const { date, time, masterId, name, phone, email, massage } = req.body;

    const exists = await pool.query(
      `SELECT 1 FROM reservations
       WHERE date = $1 AND time = $2 AND master_id = $3`,
      [date, time, masterId]
    );

    if (exists.rowCount > 0) {
      return res.status(409).json({ message: "Час вже зайнятий" });
    }

await pool.query(
  `INSERT INTO reservations (date, time, master_id, name, phone, email, massage)
   VALUES ($1,$2,$3,$4,$5,$6,$7)`,
  [date, time, masterId, name, phone, email, massage]
);


    res.status(201).json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

app.get("/availability", async (req, res) => {
  const { date } = req.query;

  if (!date) {
    return res.status(400).json({ message: "date required" });
  }

  const result = await pool.query(
    `
    SELECT 
      master_id,
      time
    FROM reservations
    WHERE date = $1
    `,
    [date]
  );

  res.json(result.rows);
});

/* ========================= */

app.listen(process.env.PORT, () => {
  console.log(`🚀 Server running on http://localhost:${process.env.PORT}`);
});