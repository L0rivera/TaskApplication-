import express from "express";
import db from "./db.js";

const router = express.Router();

let io;
export function setCommentsSocket(socketInstance) {
  io = socketInstance;
}

/* ======================================
   GET /comments/:taskId — obtener todos
======================================*/
router.get("/:taskId", (req, res) => {
  const { taskId } = req.params;

  const sql = `
    SELECT * FROM comments
    WHERE task_id = ?
    ORDER BY created_at ASC
  `;

  db.all(sql, [taskId], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });

    res.json(rows);
  });
});

/* ======================================
   POST /comments/:taskId — crear comentario
======================================*/
router.post("/:taskId", (req, res) => {
  const { taskId } = req.params;
  const { message } = req.body;

  if (!message || message.trim() === "") {
    return res.status(400).json({ error: "Message is required" });
  }

  const sql = `
    INSERT INTO comments (task_id, message)
    VALUES (?, ?)
  `;

  db.run(sql, [taskId, message], function (err) {
    if (err) return res.status(500).json({ error: err.message });

    const newComment = {
      id: this.lastID,
      task_id: taskId,
      message,
      created_at: new Date()
    };

    if (io) io.emit("comment_added", newComment);

    res.json(newComment);
  });
});

export default router;
