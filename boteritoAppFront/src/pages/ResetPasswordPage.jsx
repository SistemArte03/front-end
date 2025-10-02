import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom"; // 👈 agrega useNavigate
import "./ResetPasswordPage.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const ResetPasswordPage = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate(); // 👈 ahora puedes redirigir
  const query = new URLSearchParams(useLocation().search);
  const token = query.get("token");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error("❌ Las contraseñas no coinciden");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/usuarios/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword }),
      });

      const data = await response.text();

      if (response.ok) {
        toast.success("✅ Contraseña cambiada correctamente");
        setTimeout(() => {
          navigate("/"); // redirige al home
        }, 2000);
        setNewPassword("");
        setConfirmPassword("");
      } else {
        toast.error(data || "❌ Error al restablecer la contraseña");
      }
    } catch (err) {
      toast.error(err.message || "❌ Error al restablecer la contraseña");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reset-container">
      <div className="reset-box">
        <h2>Recuperar contraseña</h2>
        <form onSubmit={handleSubmit}>
          <label>Nueva contraseña</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />

          <label>Confirmar contraseña</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          <button type="submit" disabled={loading}>
            {loading ? "Procesando..." : "Cambiar contraseña"}
          </button>
        </form>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default ResetPasswordPage;
