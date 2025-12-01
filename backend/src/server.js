import "./initDB.js";
import express from "express";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";

import tasksRouter, { setSocketIO } from "./tasks.js";
import commentsRouter, { setCommentsSocket } from "./comments.js";
import authRouter from "./auth.js";


import "./initDB.js";

const app = express();
app.use(cors());
app.use(express.json());

// Servidor HTTP
const httpServer = createServer(app);

// Socket.IO
const io = new Server(httpServer, {
  cors: {
    origin: "*"
  }
});

// Pasar io al módulo tasks
setSocketIO(io);
setCommentsSocket(io);


// Rutas
app.use("/tasks", tasksRouter);
app.use("/comments", commentsRouter);
app.use("/auth", authRouter);



// Evento de conexión
io.on("connection", (socket) => {
  console.log("Usuario conectado:", socket.id);
});

// Iniciar servidor
const PORT = 4000;
httpServer.listen(PORT, () => {
  console.log("Servidor corriendo en puerto", PORT);
});

