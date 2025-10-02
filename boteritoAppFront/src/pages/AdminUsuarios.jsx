import React, { useEffect, useState } from "react";
import "./AdminUsuarios.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function AdminUsuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [roles, setRoles] = useState([]); // lista de roles disponibles
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newRole, setNewRole] = useState("");
  const [search, setSearch] = useState(""); // 🔎 estado para búsqueda

  // Obtener usuarios
  const fetchUsuarios = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/usuarios`, {
        credentials: "include",
      });
      if (!res.ok) { toast.error("No se pudo hacer la operación"); throw new Error("Error cargando usuarios"); }
      const data = await res.json();
      setUsuarios(data);
    } catch (err) {
      toast.error("No se pudo hacer la operación");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Obtener roles
  const fetchRoles = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/usuarios/roles`, {
        credentials: "include",
      });
      if (!res.ok) { toast.error("No se pudo hacer la operación"); throw new Error("Error cargando roles"); }
      const data = await res.json();
      setRoles(data);
    } catch (err) {
      toast.error("No se pudo hacer la operación");
      console.error(err);
    }
  };

  useEffect(() => {
    fetchUsuarios();
    fetchRoles();
  }, []);

  // Actualizar rol
  const handleUpdateRole = async (e) => {
    e.preventDefault();
    if (!selectedUser) return;

    try {
      const res = await fetch(`${API_BASE_URL}/api/usuarios/updaterole`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          ...selectedUser,
          roles_id: newRole,
        }),
      });

      if (!res.ok) { toast.error("No se pudo hacer la operación"); throw new Error("Error actualizando rol"); }
      setSelectedUser(null);
      setNewRole("");
      fetchUsuarios();
      toast.success("✅ Operación realizada correctamente");
    } catch (err) {
      toast.error("No se pudo hacer la operación");
      console.error(err);
    }
  };

  // 🔎 Filtrar usuarios por nombre, pseudónimo o email
  const usuariosFiltrados = usuarios.filter(
    (u) =>
      u.nombre?.toLowerCase().includes(search.toLowerCase()) ||
      u.pseudonimo?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="usuarios-container">
      <h2>Gestión de Usuarios</h2>

      {/* 🔎 Barra de búsqueda */}
      <input
        type="text"
        placeholder="Buscar usuario por nombre, pseudónimo o email..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="usuarios-search"
      />

      {loading ? (
        <p>Cargando usuarios...</p>
      ) : (
        <div className="table-responsive">
          <table className="usuarios-table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Pseudónimo</th>
                <th>Email</th>
                <th>Rol</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              {usuariosFiltrados.map((u) => (
                <tr key={u.id}>
                  <td>{u.nombre}</td>
                  <td>{u.pseudonimo}</td>
                  <td>{u.email}</td>
                  <td>{u.role ? u.role.rol : "Sin rol"}</td>
                  <td>
                    <button
                      onClick={() => {
                        setSelectedUser(u);
                        setNewRole(u.role?.id || "");
                      }}
                    >
                      Editar Rol
                    </button>
                  </td>
                </tr>
              ))}
              {usuariosFiltrados.length === 0 && (
                <tr>
                  <td colSpan="5">No se encontraron usuarios</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {selectedUser && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Editar Rol de {selectedUser.nombre}</h3>
            <form onSubmit={handleUpdateRole}>
              <select
                value={newRole}
                onChange={(e) => setNewRole(e.target.value)}
                required
              >
                <option value="">-- Seleccionar Rol --</option>
                {roles.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.rol}
                  </option>
                ))}
              </select>
              <div className="form-actions">
                <button type="submit">Guardar</button>
                <button type="button" onClick={() => setSelectedUser(null)}>
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}
