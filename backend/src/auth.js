import express from "express";
import bcrypt from "bcrypt";
import db from "./db.js";

const router = express.Router();

/* ======================================
   POST /register — crear usuario
======================================*/
router.post("/register", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ error: "Email and password are required" });

  // Encriptar password
  const saltRounds = 10;
  bcrypt.hash(password, saltRounds, (err, hashedPassword) => {
    if (err) return res.status(500).json({ error: "Error hashing password" });

    const sql = `
      INSERT INTO users (email, password)
      VALUES (?, ?)
    `;

    db.run(sql, [email, hashedPassword], function (err) {
      if (err) {
        if (err.message.includes("UNIQUE"))
          return res.status(400).json({ error: "Email already registered" });

        return res.status(500).json({ error: err.message });
      }

      res.json({ message: "User registered", id: this.lastID });
    });
  });
});

/* ======================================
   POST /login — iniciar sesión
======================================*/
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ error: "Email and password are required" });

  const sql = `SELECT * FROM users WHERE email = ?`;

  db.get(sql, [email], (err, user) => {
    if (err) return res.status(500).json({ error: err.message });

    if (!user)
      return res.status(400).json({ error: "User not found" });

    // Comparar password
    bcrypt.compare(password, user.password, (err, match) => {
      if (err) return res.status(500).json({ error: "Error comparing passwords" });

      if (!match)
        return res.status(400).json({ error: "Incorrect password" });

      // Login correcto
      res.json({
        message: "Login successful",
        user: {
          id: user.id,
          email: user.email
        }
      });
    });
  });
});

export default router;
