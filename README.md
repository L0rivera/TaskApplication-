# 📝 Task Management App (MVP)
Aplicación web sencilla para la gestión de tareas con tablero Kanban, comentarios y actualizaciones en tiempo real.  
Desarrollada en 2 días como un MVP funcional, usando un stack minimalista para priorizar velocidad sin perder funcionalidades clave.

---

## 🚀 Funcionalidades principales
- Tablero Kanban con columnas: **Backlog, To Do, In Progress, Done**
- **CRUD de tareas**
- Edición de estado por drag & drop
- **Comentarios** dentro de tareas
- **Actualización en tiempo real** con Socket.IO
- **Login básico** (email + password)
- Backend con **SQLite** (sin configuraciones)
- Frontend en **React + Vite**

---

## 🧱 Stack Tecnológico

### **Frontend**
- React (Vite)
- TailwindCSS
- Axios
- Zustand (estado global)
- Socket.IO Client

### **Backend**
- Node.js + Express
- SQLite3 (base de datos local)
- Socket.IO Server
- CORS

---

## 📂 Estructura del proyecto

task-app/
│
├── backend/
│ ├── db/
│ │ └── database.sqlite
│ ├── src/
│ │ ├── db.js
│ │ ├── initDB.js
│ │ ├── server.js
│ │ ├── tasks.js
│ │ ├── comments.js
│ │ └── auth.js
│ └── package.json
│
└── frontend/
├── src/
│ ├── components/
│ ├── pages/
│ ├── store/
│ ├── api.js
│ ├── App.jsx
│ └── main.jsx
├── index.html
└── package.json