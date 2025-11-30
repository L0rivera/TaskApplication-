import sqlite3 from "sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ruta al archivo de la base de datos
const dbPath = path.join(__dirname, "../db/database.sqlite");

// Conexión SQLite
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("Error al conectar a SQLite:", err);
  } else {
    console.log("Conectado a SQLite");
  }
});

export default db;
