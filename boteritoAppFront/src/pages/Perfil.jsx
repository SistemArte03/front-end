import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import "./Perfil.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const Perfil = () => {
  const navigate = useNavigate();
  const [obrasUsuario, setObrasUsuario] = useState([]);
  const [imagenModal, setImagenModal] = useState(null);
  const [formData, setFormData] = useState({
    nombre: "",
    fecha_nacimiento: "",
    pseudonimo: "",
    email: "",
    biografia: "",
    role: "",
  });

  // 🔹 Cargar datos del backend al iniciar
  useEffect(() => {
    const fetchPerfil = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/usuarios/perfil`, {
          credentials: "include",
        });
        if (!res.ok) throw new Error("Error al obtener perfil");
        const data = await res.json();

        setFormData({
          nombre: data.nombre || "",
          fechaNacimiento: data.fecha_nacimiento || "",
          pseudonimo: data.pseudonimo || "",
          email: data.email || "",
          biografia: data.biografia || "",
          correo: data.correo || "",
          role: data.role.rol || "",
        });
      } catch (err) {
        console.error(err);
      }
    };

    fetchPerfil();
  }, []);

  useEffect(() => {
    const fetchObrasUsuario = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/obras/listaObrasUsuario`, {
          credentials: "include",
        });
        if (!res.ok) throw new Error("Error al obtener obras del usuario");
        const data = await res.json();
        setObrasUsuario(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchObrasUsuario();
  }, []);

  // 🔹 Cambios en los inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleLogout = async () => {
    try {
      localStorage.removeItem("role");
      const response = await fetch(`${API_BASE_URL}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });

      if (!response.ok) {
        console.error("Error al cerrar sesión");
      }
      navigate("/");
    } catch (error) {
      console.error("Error en logout:", error);
    }
  };

  const handleUpdate = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/usuarios/update`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ biografia: formData.biografia, pseudonimo: formData.pseudonimo }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        const errorMessage = errorData?.message || errorData?.error || "Error al actualizar perfil";
        throw new Error(errorMessage);
      }

      const updatedUser = await response.json();
      setFormData({
        nombre: updatedUser.nombre || "",
        fechaNacimiento: updatedUser.fechaNacimiento || "",
        pseudonimo: updatedUser.pseudonimo || "",
        email: updatedUser.email || "",
        biografia: updatedUser.biografia || "",
        role: updatedUser.role?.rol || "",
      });

      toast.success("✅ Operación realizada correctamente");
    } catch (err) {
      console.error(err.message);
      toast.error(err.message, "No se pudo actualizar el perfil ❌");
    }
  };

  return (
    <div className="perfil-container">
      {/* Sidebar */}
      <aside className="perfil-sidebar">
        <div className="sidebar-header">
          <div className="logo">🎨</div>
          <p className="description">PERFIL <br /> </p>
        </div>
        <nav className="menu">
          <a onClick={() => navigate("/")}>Inicio</a>
          <a href="#" className="active">Perfil</a>
          <a onClick={() => navigate("/galeria")}>Galeria</a>
        </nav>
        <button className="logout-btn" onClick={() => handleLogout()}>Cerrar Sesión</button>
      </aside>

      {/* Contenido principal */}
      <main className="perfil-content">
        <div className="perfil-form-box">
          <form>
            <div className="form-grid">
              <div>
                <label>Nombre</label>
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  readOnly
                />
              </div>
              <div>
                <label>Fecha de nacimiento</label>
                <input
                  type="date"
                  name="fechaNacimiento"
                  value={formData.fechaNacimiento}
                  readOnly
                />
              </div>
              <div>
                <label>Pseudonimo</label>
                <input
                  type="text"
                  name="pseudonimo"
                  value={formData.pseudonimo}
                  onChange={handleChange}
                  
                />
              </div>
              <div>
                <label>Email</label>
                <input
                  type="text"
                  name="email"
                  value={formData.email}
                  readOnly
                />
              </div>
              <div>
                <label>Biografia</label>
                <textarea
                  name="biografia"
                  value={formData.biografia}
                  onChange={handleChange}
                  className="biografia-textarea"
                />
              </div>
              <div>
                <label>Rol</label>
                <input
                  type="text"
                  name="role"
                  value={formData.role}
                  readOnly
                />
              </div>
            </div>
            <button type="button" className="save-btn" onClick={handleUpdate}>
              Guardar Cambios
            </button>
          </form>
        </div>

        <div className="mis-obras-container">
          <h2>Mis Obras</h2>
          <div className="table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Imagen</th>
                  <th>Título</th>
                  <th>Autor</th>
                  <th>Fecha Registro</th>
                  <th>Estado de registro</th>
                </tr>
              </thead>
              <tbody>
                {obrasUsuario.length === 0 ? (
                  <tr>
                    <td colSpan="13" style={{ textAlign: "center" }}>
                      No tienes obras registradas.
                    </td>
                  </tr>
                ) : (
                  obrasUsuario.map((obra, i) => (
                    <tr key={i}>
                      <td>
                        {obra.link_obra ? (
                          <img
                            src={obra.link_obra}
                            alt={obra.titulo}
                            className="thumb-img"
                            onClick={() => setImagenModal(obra.link_obra)}
                          />
                        ) : (
                          "—"
                        )}
                      </td>
                      <td>{obra.titulo}</td>
                      <td>{obra.autor_name}</td>
                      <td>{obra.fecha_registro}</td>
                      <td>
                        <span
                          className={`status ${
                            obra.registeredStatus?.estado_registro === "validado"
                              ? "status-aprobado"
                              : obra.registeredStatus?.estado_registro === "rechazado"
                              ? "status-rechazado"
                              : "status-pendiente"
                          }`}
                        >
                          {obra.registeredStatus?.estado_registro}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {imagenModal && (
        <div className="modal-img-overlay" onClick={() => setImagenModal(null)}>
          <div className="modal-img" onClick={(e) => e.stopPropagation()}>
            <img src={imagenModal} alt="Imagen ampliada" className="full-img" />
            <button className="cancel-btn" onClick={() => setImagenModal(null)}>
              Cerrar
            </button>
          </div>
        </div>
      )}

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default Perfil;
