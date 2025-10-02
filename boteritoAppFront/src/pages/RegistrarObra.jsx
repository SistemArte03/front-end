import React, { useState, useEffect } from 'react';
import './RegistrarObra.css';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// 👉 importamos react-toastify
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Ícono para el marcador
const markerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.7/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

// Componente para capturar clic en el mapa
const LocationPicker = ({ setLatLng }) => {
  useMapEvents({
    click(e) {
      setLatLng(e.latlng);
    },
  });
  return null;
};

const RegistrarObra = () => {
  const [step, setStep] = useState(1);
  const navigate = useNavigate();
  const [obra, setObra] = useState({
    titulo: '',
    autor_name: '',
    tecnica: '',
    psuedonimo: '',
    fecha_registro: '',
    fechaCreacion: '',
    descripcion: '',
    imagen: null,
    alto: '',
    ancho: '',
    mensajeObra: '',
    tipoMural: '',
    estadoConservacionId: '',
    superficieId: '',
    lat: '',
    lng: '',
    direccion: '',
    estadoRegistradoId: '689b8fbd591b9c7ffe07d47e'
  });

  const [tecnicas, setTecnicas] = useState([]);
  const [tiposMural, setTiposMural] = useState([]);
  const [estadosConservacion, setEstadosConservacion] = useState([]);
  const [superficiesMural, setSuperficiesMural] = useState([]);

  // Estado del mapa (centrado en Tunja)
  const [latlng, setLatLng] = useState({ lat: 5.5353, lng: -73.3678 });

  // Cuando cambia el marcador, actualizar en obra
  useEffect(() => {
    setObra((prev) => ({
      ...prev,
      lat: latlng.lat,
      lng: latlng.lng,
    }));
  }, [latlng]);

  useEffect(() => {
    const fetchCatalogos = async () => {
      try {
        const [resTecnicas, resTipos, resConservacion, resSuperficies] = await Promise.all([
          fetch(`${API_BASE_URL}/api/tecnicas`, { credentials: "include" }),
          fetch(`${API_BASE_URL}/api/tipos`, { credentials: "include" }),
          fetch(`${API_BASE_URL}/api/conservacion`, { credentials: "include" }),
          fetch(`${API_BASE_URL}/api/superficies`, { credentials: "include" }),
        ]);

        if (!resTecnicas.ok || !resTipos.ok || !resConservacion.ok || !resSuperficies.ok) {
          throw new Error("Error al obtener catálogos del backend");
        }

        setTecnicas(await resTecnicas.json());
        setTiposMural(await resTipos.json());
        setEstadosConservacion(await resConservacion.json());
        setSuperficiesMural(await resSuperficies.json());
      } catch (error) {
        console.error("Error al cargar catálogos:", error);
        toast.error("❌ No se pudieron cargar los catálogos");
      }
    };

    fetchCatalogos();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setObra({ ...obra, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) setObra({ ...obra, imagen: file });
  };

  const handleUseMyLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        setLatLng({ lat: pos.coords.latitude, lng: pos.coords.longitude });
      });
    } else {
      toast.warning("⚠️ La geolocalización no es soportada por este navegador.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userId = localStorage.getItem("pseudonimo");
      const fechaLocal = new Date().toISOString().slice(0, 19);

      const formData = new FormData();
      if (obra.imagen) {
        formData.append("imagen", obra.imagen);
      }
      const obraData = {
        ...obra,
        pseudonimo: userId,
        fecha_registro: fechaLocal
      };
      delete obraData.imagen;
      formData.append("obra", new Blob([JSON.stringify(obraData)], { type: "application/json" }));

      const response = await fetch(`${API_BASE_URL}/api/obras/guardarObra`, {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      if (!response.ok) {toast.error("❌ Error al registrar la obra"); throw new Error("Error al registrar la obra");}

      toast.success("✅ Obra registrada correctamente");
      setObra({
        titulo: '',
        autor_name: '',
        psuedonimo: '',
        fecha_registro: '',
        tecnica: '',
        fechaCreacion: '',
        descripcion: '',
        imagen: null,
        alto: '',
        ancho: '',
        mensajeObra: '',
        tipoMural: '',
        estadoConservacionId: '',
        superficieId: '',
        lat: '',
        lng: '',
        direccion: '',
        estadoRegistradoId: '689b8fbd591b9c7ffe07d47e'
      });
      setStep(1);
    } catch (error) {
      toast.error("❌ Hubo un error al registrar la obra");
    }
  };

  const validateStep = (step) => {
    if (step === 1) {
      return obra.titulo.trim() !== "" &&
        obra.autor_name.trim() !== "" &&
        obra.tecnica.trim() !== "" &&
        obra.fechaCreacion.trim() !== "" &&
        obra.descripcion.trim() !== "" &&
        obra.imagen !== null;
    }
    if (step === 2) {
      return obra.tipoMural.trim() !== "" &&
        obra.estadoConservacionId.trim() !== "" &&
        obra.superficieId.trim() !== "";
    }
    if (step === 3) {
      return obra.lat !== "" && obra.lng !== "";
    }
    return true;
  };

  return (
    <div className="registro-obra-container">
      <div className="form-box">
        <h2>Registrar Obra</h2>
        <div className="step-indicator">
          <span className={step === 1 ? 'active' : ''}>•</span>
          <span className={step === 2 ? 'active' : ''}>•</span>
          <span className={step === 3 ? 'active' : ''}>•</span>
        </div>

        <form onSubmit={handleSubmit}>
          {step === 1 && (
            <>
              <input type="text" name="titulo" placeholder="Título" value={obra.titulo} onChange={handleChange} required />
              <input type="text" name="autor_name" placeholder="Autor" value={obra.autor_name} onChange={handleChange} required />

              <select name="tecnica" value={obra.tecnica} onChange={handleChange} required>
                <option value="">Seleccione técnica</option>
                {tecnicas.map((t) => (
                  <option key={t.id} value={t.id}>{t.tecnica}</option>
                ))}
              </select>

              <label htmlFor="fecha" className="input-label">Fecha de creación del mural</label>
              <input type="date" id="fechaCreacion" name="fechaCreacion" value={obra.fechaCreacion} onChange={handleChange} required />

              <textarea name="descripcion" placeholder="Descripción" value={obra.descripcion} onChange={handleChange} />

              <label className="file-label">
                Cargar Imagen
                <input type="file" accept="image/*" capture="environment" onChange={handleImageChange} />
              </label>
              {obra.imagen && <p className="file-info">📸 Imagen lista: {obra.imagen.name}</p>}

              <button type="button" onClick={() => {
                if (validateStep(1)) {
                  setStep(2);
                } else {
                  toast.warning("⚠️ Completa todos los campos del paso 1 antes de continuar.");
                }
              }}>Siguiente</button>
              <button type="button" onClick={() => navigate("/")}>Menu Principal</button>
            </>
          )}

          {step === 2 && (
            <>
              <input type="number" name="alto" placeholder="Alto cm" value={obra.alto} onChange={handleChange} min="0" step="1"/>
              <input type="number" name="ancho" placeholder="Ancho cm" value={obra.ancho} onChange={handleChange} min="0" step="1"/>
              <textarea name="mensajeObra" placeholder="Mensaje que le transmite de la obra" value={obra.mensajeObra} onChange={handleChange} />

              <select name="tipoMural" value={obra.tipoMural} onChange={handleChange} required>
                <option value="">Seleccione tipo de mural</option>
                {tiposMural.map((tm) => (
                  <option key={tm.id} value={tm.id}>{tm.tipo_mural}</option>
                ))}
              </select>

              <select name="estadoConservacionId" value={obra.estadoConservacionId} onChange={handleChange} required>
                <option value="">Seleccione estado de conservación</option>
                {estadosConservacion.map((ec) => (
                  <option key={ec.id} value={ec.id}>{ec.estado}</option>
                ))}
              </select>

              <select name="superficieId" value={obra.superficieId} onChange={handleChange} required>
                <option value="">Seleccione superficie del mural</option>
                {superficiesMural.map((sm) => (
                  <option key={sm.id} value={sm.id}>{sm.superficie}</option>
                ))}
              </select>

              <div className="button-group">
                <button type="button" onClick={() => setStep(1)}>Anterior</button>
                <button type="button" onClick={() => {
                  if (validateStep(2)) {
                    setStep(3);
                  } else {
                    toast.warning("⚠️ Completa todos los campos del paso 2 antes de continuar.");
                  }
                }}>Siguiente</button>
                <button type="button" onClick={() => navigate("/")}>Menu Principal</button>
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <MapContainer center={[5.5353, -73.3678]} zoom={14}>
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <LocationPicker setLatLng={setLatLng} />
                <Marker position={[latlng.lat, latlng.lng]} icon={markerIcon} />
              </MapContainer>

              <button type="button" onClick={handleUseMyLocation} style={{ marginBottom: "10px" }}>
                📍 Usar mi ubicación actual
              </button>

              <textarea
                name="direccion"
                placeholder="Dirección (opcional)"
                value={obra.direccion}
                onChange={handleChange}
              />

              <div className="button-group">
                <button type="button" onClick={() => setStep(2)}>Anterior</button>
                <button type="submit">Registrar</button>
                <button type="button" onClick={() => navigate("/")}>Menu Principal</button>
              </div>
            </>
          )}
        </form>
      </div>

      {/* 👉 contenedor de Toastify */}
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default RegistrarObra;
