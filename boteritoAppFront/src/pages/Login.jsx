import React, { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { useNavigate, useLocation } from "react-router-dom"; 
import { GoogleLogin } from "@react-oauth/google";
import "./Login.css";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function Login() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  // 👈 Guardamos a dónde ir después del login (si no hay, por defecto "/")
  const from = location.state?.from?.pathname || "/";

  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = e.target.email.value.trim().toLowerCase();
    const password = e.target.password.value.trim();

    if (!email || !password) {
      setError("Por favor, completa todos los campos.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include", // necesario
      });

      const data = await response.json();
      console.log(data);

      if (!response.ok) {
        // 👈 usamos el mensaje que devuelva el backend o un texto genérico
        throw new Error(data.error || data.message || "Credenciales inválidas");
      }

      if (data.role) {
        localStorage.setItem("role", data.role); 
      }
      if (data.pseudonimo) {
        localStorage.setItem("pseudonimo", data.pseudonimo); 
      }

      // 👈 Redirigir a la página donde estaba antes
      navigate(from, { replace: true });

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const token = credentialResponse.credential; // 👈 JWT de Google

      const response = await fetch(`${API_BASE_URL}/auth/google`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
        credentials: "include",
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || data.message || "Error con Google login");

      if (data.role) localStorage.setItem("role", data.role);
      if (data.pseudonimo) localStorage.setItem("pseudonimo", data.pseudonimo);

      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message);
    }
  };

  const handleGoogleFailure = () => {
    setError("Error al iniciar sesión con Google");
  };

  return (
    <div className="login-page">
      <div className="overlay"></div>

      <div className="login-container">
        {error && <div className="error-message">{error}</div>}

        <h2 className="title">Iniciar Sesión</h2>

        <form className="login-form" onSubmit={handleSubmit}>
          <input 
            type="email" 
            name="email" 
            placeholder="Email"  
            onChange={(e) => { e.target.value = e.target.value.toLowerCase(); }}
          />
          <input type="password" name="password" placeholder="Contraseña" />
          <button type="submit" className="btn-submit" disabled={loading}>
            {loading ? "Cargando..." : "Ingresar"}
          </button>
        </form>

        <p className="register-link">
          ¿No tienes una cuenta? <a href="/RegistrarUsuario">Regístrate</a>
        </p>

        <p className="forgot-password">
          ¿Olvidaste tu contraseña? <a href="/forgot-password">Recupérala aquí</a>
        </p>

        <div className="btn-google">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleFailure}
          />
        </div>
      </div>
    </div>
  );
}
