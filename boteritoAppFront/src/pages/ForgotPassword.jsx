import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // 👈 importar el hook
import "./ForgotPassword.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate(); // 👈 inicializar

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE_URL}/api/usuarios/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.text();
      setMessage(data);

      // 👇 Redirigir al home después de éxito
      if (res.ok) {
        setTimeout(() => {
          navigate("/"); 
        }, 2000);
        toast.success("✅ Operación realizada correctamente"); // espera 2 segundos para mostrar el mensaje antes de redirigir
      }
    } catch (error) {
      toast.error("❌ Error al enviar el correo de recuperación.");
      setMessage("❌ Error al enviar el correo de recuperación.");
    }
  };

  return (
    <div className="forgot-container">
      <h2>Recuperar contraseña</h2>
      <form onSubmit={handleSubmit}>
        <input 
          type="email" 
          placeholder="Ingresa tu correo" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          required 
        />
        <button type="submit">Enviar enlace</button>
      </form>
      {message && <p className="message">{message}</p>}
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}
