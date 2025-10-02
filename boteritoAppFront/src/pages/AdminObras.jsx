import { useState, useEffect } from "react";
import { Menu, CheckCircle, XCircle, BookOpen, Edit3 } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import "./AdminObras.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function AdminObras() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [obras, setObras] = useState([]);

  const navigate = useNavigate();
  const [modalAbierto, setModalAbierto] = useState(false);
  const [estado_registro, setEstadoRegistro] = useState(null);
  const [filtroEstado, setFiltroEstado] = useState("TODOS");
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  const [tecnicas, setTecnicas] = useState([]);
  const [tiposMural, setTiposMural] = useState([]);
  const [estadosConservacion, setEstadosConservacion] = useState([]);
  const [superficiesMural, setSuperficiesMural] = useState([]);
  const [ilustraciones, setIlustraciones] = useState([]);
  const [tipografias, setTipografias] = useState([]);

  const [imagenModal, setImagenModal] = useState(null);



  useEffect(() => {
    fetch(`${API_BASE_URL}/api/obras`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then(res => res.json())
      .then(data => {
        setObras(data);
      })
      .catch(err => console.error(err));
  }, []);

  useEffect(() => {
    const fetchCatalogos = async () => {
      try {
        const [resTecnicas, resTipos, resConservacion, resSuperficies, resIlustraciones, resTipografias] = await Promise.all([
          fetch(`${API_BASE_URL}/api/tecnicas`, { credentials: "include" }),
          fetch(`${API_BASE_URL}/api/tipos`, { credentials: "include" }),
          fetch(`${API_BASE_URL}/api/conservacion`, { credentials: "include" }),
          fetch(`${API_BASE_URL}/api/superficies`, { credentials: "include" }),
          fetch(`${API_BASE_URL}/api/ilustraciones`, { credentials: "include" }),
          fetch(`${API_BASE_URL}/api/tipografias`, { credentials: "include" }),
        ]);

        if (!resTecnicas.ok || !resTipos.ok || !resConservacion.ok || !resSuperficies.ok || !resIlustraciones.ok) {
          toast.error("No se pudo hacer la operación");
          throw new Error("Error al obtener catálogos del backend");
        }

        setTecnicas(await resTecnicas.json());
        setTiposMural(await resTipos.json());
        setEstadosConservacion(await resConservacion.json());
        setSuperficiesMural(await resSuperficies.json());
        setIlustraciones(await resIlustraciones.json());
        setTipografias(await resTipografias.json());
      } catch (error) {
        toast.error("No se pudo hacer la operación")
        console.error("Error al cargar catálogos:", error);
      }
    };

    fetchCatalogos();
  }, []);



  // 🔹 Abrir modal con datos de la obra
  const abrirModal = (obra, index) => {
    setEstadoRegistro({ ...obra, index });
    setModalAbierto(true);
  };

  // 🔹 Cerrar modal
  const cerrarModal = () => {
    setEstadoRegistro(null);
    setModalAbierto(false);
  };

  // 🔹 Manejar cambios en los inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEstadoRegistro((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // 🔹 Guardar cambios en modal (sin cambiar estado)
  async function actualizarObra(obraData) {
    const payload = {
      id: obraData.id,
      titulo: obraData.titulo,
      fechaCreacion: obraData.fechaCreacion,
      descripcion: obraData.descripcion,
      mensaje: obraData.mensaje,
      tecnicaId: obraData.tecnica?.id || null,
      tipoMuralId: obraData.tipo?.id || null,
      ilustracionId: obraData.ilustracion?.id || null,
      superficieId: obraData.surface?.id || null,
      estadoConservacionId: obraData.estadoConservacion?.id || null,
      ubicacionId: obraData.ubicacion?.id || null,
      ancho: obraData.ancho,
      alto: obraData.alto,
      observaciones: obraData.observaciones,
      autor_name: obraData.autor_name,
      tipografiasId: obraData.typography?.id || null,
      contexto_historico: obraData.contexto_historico,
      restaurador: obraData.restaurador,
      estadoRegistradoId: obraData.registeredStatus?.id || null,
      id_usuario_carga: obraData.owner_user?.id || obraData.id_usuario_carga,
      fecha_registro: obraData.fecha_registro,
      link_obra: obraData.link_obra,
    };

    try {
      console.log(payload)
      const response = await fetch(`${API_BASE_URL}/api/obras/updateObra`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
        credentials: "include",
      });

      if (!response.ok) {
        toast.error("No se pudo hacer la operación");
        throw new Error("Error al actualizar la obra");
      }

      const data = await response.json();
      toast.success("✅ Operación realizada correctamente");
      return data;
    } catch (error) {
      toast.error("No se pudo hacer la operación")
      console.error("Error:", error);
    }
  }

  const cambiarEstado = async (obra, index, estadoRegistroId) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/obras/${obra.id}/validarobra?idRegisteredStatus=${estadoRegistroId}`,
        {
          method: "PATCH",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        toast.error("No se pudo hacer la operación");
        throw new Error("Error al actualizar la obra");

      }

      // ✅ Actualizamos el estado local
      const nuevasObras = [...obras];
      nuevasObras[index] = {
        ...obra,
        registeredStatus: {
          ...obra.registeredStatus,
          id: estadoRegistroId,  // guardamos el nuevo id del estado
        },
      };
      toast.success("✅ Operación realizada correctamente");
      setObras(nuevasObras);

    } catch (err) {
      toast.error("No se pudo hacer la operación")
      console.error("Fallo en PATCH:", err);
    }
  };


  const obrasFiltradas = obras.filter((obra) => {
    const coincideBusqueda = obra.titulo?.toLowerCase().includes(search.toLowerCase());
    const coincideEstado =
      filtroEstado === "TODOS" || obra.registeredStatus?.estado_registro === filtroEstado;

    return coincideBusqueda && coincideEstado;
  });

  return (
    <div className="admin-container">
      {/* Navbar */}
      <header className="navbar">
        <div className="left-section">
          <Menu className="menu-icon" onClick={toggleMenu} />
          <nav>
            <ul>
              <li className="active">Panel de Obras</li>
            </ul>
          </nav>
        </div>
      </header>

      {/* Sidebar */}
      {isMenuOpen && (
        <div className="menu-overlay" onClick={closeMenu}>
          <aside className="sidebar" onClick={(e) => e.stopPropagation()}>
            <ul>
              <li onClick={() => { setFiltroEstado("registrado"); closeMenu(); }}>
                <BookOpen size={20} /> <span>Obras Registradas</span>
              </li>
              <li onClick={() => { setFiltroEstado("validado"); closeMenu(); }}>
                <CheckCircle size={20} /> <span>Obras Validadas</span>
              </li>
              <li onClick={() => { setFiltroEstado("rechazado"); closeMenu(); }}>
                <XCircle size={20} /> <span>Obras Rechazadas</span>
              </li>
              <li onClick={() => navigate("/admin/usuarios")}>
                <XCircle size={20} /> <span>Administrar Usuarios</span>
              </li>
            </ul>

          </aside>
        </div>
      )}

      {/* Card con tabla */}
      <div className="admin-card">
        <div className="card-header">
          <input
            type="text"
            placeholder="Buscar obra..."
            className="search-input"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Título de la obra</th>
                <th>Imagen</th>
                <th>Autor</th>
                <th>Fecha</th>
                <th>Tipografías</th>
                <th>Ilustración</th>
                <th>Tipo mural</th>
                <th>Técnica</th>
                <th>Conservación</th>
                <th>Altura</th>
                <th>Anchura</th>
                <th>Descripción</th>
                <th>Superficie</th>
                <th>Mensaje</th>
                <th>Contexto</th>
                <th>Localización</th>
                <th>Restaurador</th>
                <th>Observaciones</th>
                <th>Estado</th>
                <th>Acciones</th>

              </tr>
            </thead>
            <tbody>
              {obrasFiltradas.map((obra, i) => (
                <tr key={i}>
                  <td>{obra.titulo}</td>
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

                  <td>{obra.autor_name}</td>
                  <td>{obra.fechaCreacion}</td>
                  <td>{obra.typography?.tipografia || "—"}</td>
                  <td>{obra.ilustracion?.ilustracion || "—"}</td>
                  <td>{obra.tipo?.tipo_mural || "—"}</td>
                  <td>{obra.tecnica?.tecnica || "—"}</td>
                  <td>{obra.estadoConservacion?.estado || "—"}</td>
                  <td>{obra.alto}</td>
                  <td>{obra.ancho}</td>
                  <td>{obra.descripcion}</td>
                  <td>{obra.surface?.superficie || "—"}</td>
                  <td>{obra.mensaje}</td>
                  <td>{obra.contexto_historico}</td>
                  <td>{obra.ubicacion?.direccion || "—"}</td>
                  <td>{obra.restaurador}</td>
                  <td>{obra.observaciones}</td>
                  <td>
                    <span
                      className={`status ${obra.registeredStatus?.estado_registro === "validado"
                        ? "status-aprobado"
                        : obra.registeredStatus?.estado_registro === "rechazado"
                          ? "status-rechazado"
                          : "status-pendiente"
                        }`}
                    >
                      {obra.registeredStatus?.estado_registro}
                    </span>
                  </td>
                  <td className="acciones">
                    <Edit3
                      size={20}
                      className="icon-btn edit"
                      onClick={() => abrirModal(obra, i)}
                      title="Editar"
                    />
                    <CheckCircle
                      size={20}
                      className="icon-btn accept"
                      onClick={() => cambiarEstado(obra, i, "689b8fda591b9c7ffe07d47f")}
                      title="Aceptar"
                    />
                    <XCircle
                      size={20}
                      className="icon-btn reject"
                      onClick={() => cambiarEstado(obra, i, "689b8ff3591b9c7ffe07d480")}
                      title="Rechazar"
                    />
                  </td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>
      </div>

      {/* Modal de edición */}
      {modalAbierto && estado_registro && (
        <div className="modal-overlay" onClick={cerrarModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Editar Obra</h2>
            <div className="modal-form">
              {/* Título */}
              <div className="form-group">
                <label>Título</label>
                <input
                  type="text"
                  name="titulo"
                  value={estado_registro.titulo || ""}
                  onChange={handleChange}
                />
              </div>

              {/* Autor */}
              <div className="form-group">
                <label>Autor</label>
                <input
                  type="text"
                  name="autor_name"
                  value={estado_registro.autor_name || ""}
                  onChange={handleChange}
                />
              </div>

              {/* Fecha */}
              <div className="form-group">
                <label>Fecha</label>
                <input
                  type="date"
                  name="fechaCreacion"
                  value={estado_registro.fechaCreacion || ""}
                  onChange={handleChange}
                />
              </div>

              {/* Descripción */}
              <div className="form-group">
                <label>Descripción</label>
                <textarea
                  name="descripcion"
                  value={estado_registro.descripcion || ""}
                  onChange={handleChange}
                />
              </div>

              {/* Mensaje */}
              <div className="form-group">
                <label>Mensaje</label>
                <textarea
                  name="mensaje"
                  value={estado_registro.mensaje || ""}
                  onChange={handleChange}
                />
              </div>

              {/* Contexto */}
              <div className="form-group">
                <label>Contexto Historico</label>
                <textarea
                  name="contexto_historico"
                  value={estado_registro.contexto_historico || ""}
                  onChange={handleChange}
                />
              </div>

              {/* Contexto */}
              <div className="form-group">
                <label>Restaurador</label>
                <textarea
                  name="restaurador"
                  value={estado_registro.restaurador || ""}
                  onChange={handleChange}
                />
              </div>

              {/* Técnica */}
              <div className="form-group">
                <label>Técnica</label>
                <select
                  name="tecnica"
                  value={estado_registro.tecnica?.id || ""}
                  onChange={(e) =>
                    setEstadoRegistro((prev) => ({
                      ...prev,
                      tecnica: { id: e.target.value },
                    }))
                  }
                >
                  <option value="">Seleccione técnica</option>
                  {tecnicas.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.tecnica}
                    </option>
                  ))}
                </select>
              </div>

              {/* Tipo mural */}
              <div className="form-group">
                <label>Tipo mural</label>
                <select
                  name="tipo"
                  value={estado_registro.tipo?.id || ""}
                  onChange={(e) =>
                    setEstadoRegistro((prev) => ({
                      ...prev,
                      tipo: { id: e.target.value },
                    }))
                  }
                >
                  <option value="">Seleccione tipo de mural</option>
                  {tiposMural.map((tm) => (
                    <option key={tm.id} value={tm.id}>
                      {tm.tipo_mural}
                    </option>
                  ))}
                </select>
              </div>

              {/* Estado de conservación */}
              <div className="form-group">
                <label>Conservación</label>
                <select
                  name="estadoConservacion"
                  value={estado_registro.estadoConservacion?.id || ""}
                  onChange={(e) =>
                    setEstadoRegistro((prev) => ({
                      ...prev,
                      estadoConservacion: { id: e.target.value },
                    }))
                  }
                >
                  <option value="">Seleccione estado de conservación</option>
                  {estadosConservacion.map((ec) => (
                    <option key={ec.id} value={ec.id}>
                      {ec.estado}
                    </option>
                  ))}
                </select>
              </div>

              {/* Superficie */}
              <div className="form-group">
                <label>Superficie</label>
                <select
                  name="surface"
                  value={estado_registro.surface?.id || ""}
                  onChange={(e) =>
                    setEstadoRegistro((prev) => ({
                      ...prev,
                      surface: { id: e.target.value },
                    }))
                  }
                >
                  <option value="">Seleccione superficie</option>
                  {superficiesMural.map((sm) => (
                    <option key={sm.id} value={sm.id}>
                      {sm.superficie}
                    </option>
                  ))}
                </select>
              </div>

              {/* Ilustración */}
              <div className="form-group">
                <label>Ilustración</label>
                <select
                  name="ilustracion"
                  value={estado_registro.ilustracion?.id || ""}
                  onChange={(e) =>
                    setEstadoRegistro((prev) => ({
                      ...prev,
                      ilustracion: { id: e.target.value },
                    }))
                  }
                >
                  <option value="">Seleccione ilustración</option>
                  {ilustraciones.map((il) => (
                    <option key={il.id} value={il.id}>
                      {il.ilustracion}
                    </option>
                  ))}
                </select>
              </div>


              {/* TipoGrafias */}
              <div className="form-group">
                <label>Tipografia</label>
                <select
                  name="tipografia"
                  value={estado_registro.typography?.id || ""}
                  onChange={(e) =>
                    setEstadoRegistro((prev) => ({
                      ...prev,
                      typography: { id: e.target.value },
                    }))
                  }
                >
                  <option value="">Seleccione tipografia</option>
                  {tipografias.map((il) => (
                    <option key={il.id} value={il.id}>
                      {il.tipografia}
                    </option>
                  ))}
                </select>
              </div>

              {/* Observaciones */}
              <div className="form-group">
                <label>Observaciones</label>
                <textarea
                  name="observaciones"
                  value={estado_registro.observaciones || ""}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="modal-actions">
              <button
                className="save-btn"
                onClick={() => {
                  actualizarObra(estado_registro);
                  cerrarModal();
                }}
              >
                Actualizar
              </button>
              <button className="cancel-btn" onClick={cerrarModal}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
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
}
