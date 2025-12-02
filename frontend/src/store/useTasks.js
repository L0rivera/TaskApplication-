import { create } from "zustand";
import API from "../api";
import { socket } from "../socket";

const useTasks = create((set, get) => ({
  tasks: [],
  loading: false,
  error: null,

  /* ============================
     Cargar tareas del backend
  ==============================*/
  fetchTasks: async () => {
    set({ loading: true });

    try {
      const res = await API.get("/tasks");
      set({ tasks: res.data, loading: false });

    } catch (err) {
      set({
        error: err.response?.data?.error || "Error loading tasks",
        loading: false
      });
    }
  },

  /* ============================
     Crear una nueva tarea
  ==============================*/
  createTask: async (title, description = "") => {
    try {
      const res = await API.post("/tasks", {
        title,
        description,
        status: "backlog"
      });

      set({ tasks: [res.data, ...get().tasks] });

    } catch (err) {
      set({ error: "Error creating task: " + err });
    }
  },

  /* ============================
     Actualizar tarea completa
  ==============================*/
  updateTask: async (id, updates) => {
    try {
      const res = await API.put(`/tasks/${id}`, updates);

      const updated = res.data;
      set({
        tasks: get().tasks.map((t) =>
          t.id == id ? { ...t, ...updated } : t
        ),
      });

    } catch (err) {
      set({ error: "Error updating task: " + err });
    }
  },

  /* ============================
     Cambiar status (Kanban)
  ==============================*/
  moveTask: async (id, status) => {
    try {
      await API.put(`/tasks/${id}/status`, { status });

      set({
        tasks: get().tasks.map((t) =>
          t.id == id ? { ...t, status } : t
        ),
      });

    } catch (err) {
      set({ error: "Error moving task: " + err });
    }
  },

  /* ============================
     Eliminar tarea
  ==============================*/
  deleteTask: async (id) => {
    try {
      await API.delete(`/tasks/${id}`);

      set({
        tasks: get().tasks.filter((t) => t.id != id),
      });

    } catch (err) {
      set({ error: "Error deleting task: " + err });
    }
  },

  /* ============================
     Conectar a sockets en tiempo real
  ==============================*/
  connectSocket: () => {
    // Evitar doble conexión
    if (socket.connected === false) socket.connect();

    // Nueva tarea creada
    socket.on("task_created", (task) => {
      set({ tasks: [task, ...get().tasks] });
    });

    // Tarea actualizada
    socket.on("task_updated", (task) => {
      set({
        tasks: get().tasks.map((t) =>
          t.id == task.id ? { ...t, ...task } : t
        ),
      });
    });

    // Cambio de columna (status)
    socket.on("task_moved", (task) => {
      set({
        tasks: get().tasks.map((t) =>
          t.id == task.id ? { ...t, status: task.status } : t
        ),
      });
    });

    // Tarea borrada
    socket.on("task_deleted", ({ id }) => {
      set({
        tasks: get().tasks.filter((t) => t.id != id)
      });
    });
  },
}));

export default useTasks;
