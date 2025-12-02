import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:4000",
});

// Ej: API.get("/tasks")

export default API;
