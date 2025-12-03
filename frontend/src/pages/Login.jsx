import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../store/useAuth";

export default function Login() {
  const navigate = useNavigate();
  const login = useAuth((s) => s.login);
  const error = useAuth((s) => s.error);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const success = await login(email, password);

    if (success) {
      navigate("/home");
    }
  };

  return (
    <div className="w-full h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-blue-700">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-2xl p-8 rounded-xl w-96 space-y-5"
      >
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800">Bienvenido</h2>
          <p className="text-gray-500 text-sm mt-2">Inicia sesión en tu cuenta</p>
        </div>

        // ...existing code...

        <input
          type="email"
          placeholder="Email"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-black placeholder-gray-400"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Contraseña"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-black placeholder-gray-400"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

// ...existing code...

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition duration-200 transform hover:scale-105"
        >
          Entrar
        </button>

        <p className="text-center text-gray-600 text-sm">
          ¿No tienes cuenta? <span className="text-blue-600 font-semibold cursor-pointer hover:underline">Regístrate</span>
        </p>
      </form>
    </div>
  );
}