import express from "express";
import db from "./db.js";

const router = express.Router();

// Necesitamos acceso a io (socket) desde server.js
let io;
export function setSocketIO(socketInstance) {
  io = socketInstance;
}

/* ===============================
   GET /tasks — obtener todas
================================*/
router.get("/", (req, res) => {
  const sql = "SELECT * FROM tasks ORDER BY id DESC";

  db.all(sql, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });

    res.json(rows);
  });
});

/* ===============================
   GET /tasks/:id — obtener una
================================*/
router.get("/:id", (req, res) => {
  const { id } = req.params;

  db.get("SELECT * FROM tasks WHERE id = ?", [id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: "Task not found" });

    res.json(row);
  });
});

/* ===============================
   POST /tasks — crear una tarea
================================*/
router.post("/", (req, res) => {
  const { title, description, status } = req.body;

  if (!title) {
    return res.status(400).json({ error: "Title is required" });
  }

  const sql = `
    INSERT INTO tasks (title, description, status)
    VALUES (?, ?, ?)
  `;

  db.run(sql, [title, description || "", status || "backlog"], function (err) {
    if (err) return res.status(500).json({ error: err.message });

    const newTask = {
      id: this.lastID,
      title,
      description: description || "",
      status: status || "backlog",
      created_at: new Date()
    };

    if (io) io.emit("task_created", newTask);

    res.json(newTask);
  });
});

/* =======================================
   PUT /tasks/:id — actualizar una tarea
=========================================*/
router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { title, description, status } = req.body;

  const sql = `
    UPDATE tasks
    SET title = ?, description = ?, status = ?
    WHERE id = ?
  `;

  db.run(sql, [title, description, status, id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0)
      return res.status(404).json({ error: "Task not found" });

    const updatedTask = { id, title, description, status };

    if (io) io.emit("task_updated", updatedTask);

    res.json(updatedTask);
  });
});

/* =======================================
   PUT /tasks/:id/status — mover tarea
=========================================*/
router.put("/:id/status", (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const sql = `
    UPDATE tasks
    SET status = ?
    WHERE id = ?
  `;

  db.run(sql, [status, id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0)
      return res.status(404).json({ error: "Task not found" });

    const movedTask = { id, status };

    if (io) io.emit("task_moved", movedTask);

    res.json(movedTask);
  });
});

/* ===============================
   DELETE /tasks/:id — eliminar
================================*/
router.delete("/:id", (req, res) => {
  const { id } = req.params;

  db.run("DELETE FROM tasks WHERE id = ?", id, function (err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0)
      return res.status(404).json({ error: "Task not found" });

    if (io) io.emit("task_deleted", { id });

    res.json({ message: "Task deleted" });
  });
});

export default router;
