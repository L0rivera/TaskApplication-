import axios from "axios";

const API = axios.create({
  baseURL: "https://taskapplication-backend-ymhq.onrender.com",
});

// Ej: API.get("/tasks")

export default API;
