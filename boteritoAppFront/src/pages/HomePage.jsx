import { Menu, User, Filter, Image, Plus, LogIn, ArrowDownCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './HomePage.css';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const HomePage = () => {


  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("role"));
  const [role, setRole] = useState(localStorage.getItem("role") || "");
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showFilterOptions, setShowFilterOptions] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('');
  const [filterValue, setFilterValue] = useState('');
  const [allImages, setAllImages] = useState([]);
  const navigate = useNavigate();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  const getFilterField = (img, filterType) => {
    switch (filterType) {
      case "tipo":
        return img.tipo?.tipo_mural || "";
      case "tecnica":
        return img.tecnica?.tecnica || "";
      case "ilustracion":
        return img.ilustracion?.ilustracion || "";
      default:
        return "";
    }
  }
  const getFilteredImages = () => {
    if (!selectedFilter || !filterValue) return allImages;
    return allImages.filter((img) => getFilterField(img, selectedFilter) === filterValue);
  };
  const getFilterOptions = (filterType) => {
    const options = allImages.map(img => getFilterField(img, filterType));
    return [...new Set(options)]; // eliminamos duplicados
  };


  const filteredImages = getFilteredImages();
  const groups = [];
  for (let i = 0; i < filteredImages.length; i += 4) {
    groups.push(filteredImages.slice(i, i + 4));
  }

  const handleLogout = async () => {
    try {
      // Elimina el rol del localStorage
      localStorage.removeItem("role");
      setRole("");
      setIsLoggedIn(false);


      // Llamada al backend para limpiar cookie
      const response = await fetch(`${API_BASE_URL}/auth/logout`, {
        method: "POST",
        credentials: "include", // necesario para mandar la cookie
      });

      if (response.ok) {
        console.log("Logout exitoso");
      } else {
        console.error("Error al cerrar sesión");
      }

      // Cambiar estado y redirigir
      setIsLoggedIn(false);
      navigate("/");
    } catch (error) {
      console.error("Error en logout:", error);
    }
  };



  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % groups.length);
    }, 10000);
    return () => clearInterval(interval);
  }, [groups.length]);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/obras/listaObras`)
      .then(res => res.json())
      .then(data => {
        setAllImages(data)
      })
      .catch(err => console.error(err));
  }, []);

  const customIcon = new L.Icon({
    iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
    shadowSize: [41, 41],
  });




  return (
    <div className="home-container">
      <header className="navbar">
        <div className="left-section">
          <Menu className="menu-icon" onClick={toggleMenu} />
          <nav>
            <ul>
              <li className="active"></li>
            </ul>
          </nav>
        </div>

        {/* 🔹 Botón de ingresar decente */}
        <div className="right-section">
          <span className="app-title">Boterito APP</span>
          {isLoggedIn ? (
            <button
              className="btn-ingresar"
              onClick={() => {
                handleLogout();
                navigate("/");
              }}
            >
              <LogIn size={18} style={{ marginRight: "6px" }} />
              Cerrar sesión
            </button>
          ) : (
            <button
              className="btn-ingresar"
              onClick={() => navigate("/login")}
            >
              <LogIn size={18} style={{ marginRight: "6px" }} />
              Ingresar
            </button>
          )}
        </div>

      </header>

      {isMenuOpen && (
        <div className="menu-overlay" onClick={closeMenu}>
          <aside className="sidebar" onClick={(e) => e.stopPropagation()}>
            <ul>
              <li onClick={() => {
                closeMenu();
                if (!isLoggedIn) {
                  navigate("/login", { state: { from: "/registrar" } });
                } else {
                  navigate("/perfil");
                }
              }}><User size={20} /> <span>Perfil</span></li>
              <li onClick={() => setShowFilterOptions(!showFilterOptions)}>
                <Filter size={20} /> <span>Filtros</span>
              </li>
              {showFilterOptions && (
                <div className="filter-section">
                  <label htmlFor="filterType">Tipo de filtro:</label>
                  <select
                    id="filterType"
                    value={selectedFilter}
                    onChange={(e) => {
                      setSelectedFilter(e.target.value);
                      setFilterValue('');
                    }}
                  >
                    <option value="">-- Tipo --</option>
                    <option value="tipo">Tipo de mural</option>
                    <option value="tecnica">Técnica</option>
                    <option value="ilustracion">Ilustracion</option>
                  </select>


                  {selectedFilter && (
                    <>
                      <label htmlFor="filterValue">Valor:</label>
                      <select
                        id="filterValue"
                        value={filterValue}
                        onChange={(e) => setFilterValue(e.target.value)}
                      >
                        <option value="">-- Valor --</option>
                        {getFilterOptions(selectedFilter).map((val, i) => (
                          <option key={i} value={val}>{val}</option>
                        ))}
                      </select>
                    </>
                  )}
                </div>
              )}
              <li onClick={() => {
                  closeMenu();
                  navigate("/galeria");
                }}><Image size={20} /> <span>Galería</span></li>

              <li
                onClick={() => {
                  closeMenu();
                  navigate("/registrarusuario");
                }}
              >
                <User size={20} /> <span>Registrar usuario</span>
              </li>

              <li
                onClick={() => {
                  closeMenu();
                  if (!isLoggedIn) {
                    navigate("/login", { state: { from: "/registrar" } });
                  } else {
                    navigate("/registrar");
                  }
                }}
              >
                <Plus size={20} /> <span>Registrar obra</span>
              </li>
              {role === "ADMIN" && (
                <li
                  onClick={() => {
                    closeMenu();
                    navigate("/admin");

                  }}
                >
                  <Plus size={20} /> <span>Administrador</span>
                </li>
              )}
            </ul>
          </aside>
        </div>
      )}

      <main className="main">
        <MapContainer
          center={[5.538, -73.367]}
          zoom={13}
          scrollWheelZoom={false}
          className="map-background"
          style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="© OpenStreetMap contributors"
          />

          {/* Puntos de las obras */}
          {allImages.map((obra, i) => (
            obra.ubicacion?.lat && obra.ubicacion?.lng && (
              <Marker
                key={i}
                position={[obra.ubicacion.lat, obra.ubicacion.lng]}
                icon={customIcon}
              >
                <Popup>
                  <div className="popup-content">
                    <strong>{obra.titulo || "Obra"}</strong><br />
                    {obra.descripcion || "Sin descripción"}<br />
                    <img src={obra.link_obra} alt="obra" style={{ width: "150px", borderRadius: "8px", marginTop: "5px" }} />
                  </div>
                </Popup>
              </Marker>
            )
          ))}
        </MapContainer>

        <div className="carousel-fixed relative">
          <div
            className="slider"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {groups.map((group, groupIndex) => (
              <div key={groupIndex} className="slide-group">
                {group.map((img, index) => (
                  <div
            key={index}
            className="image-clickable"
            onClick={() => navigate("/galeria")}
          >
            <img
              src={img.link_obra}
              alt={`Obra ${index}`}
            />
          </div>
                ))}
          </div>
            ))}
          </div>
        </div>


      </main>
    </div>
  );
};

export default HomePage;
