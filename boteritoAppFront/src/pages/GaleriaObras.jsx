import { useEffect, useState } from "react";
import { Heart, MessageCircle, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./GaleriaObras.css";
import * as leoProfanity from "leo-profanity";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function GaleriaObras() {
  const [allImages, setAllImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedObra, setSelectedObra] = useState(null);
  const [isLoggedIn] = useState(!!localStorage.getItem("role"));
  const [pseudonimo_user] = useState(localStorage.getItem("pseudonimo"));
  const [animatingLike, setAnimatingLike] = useState(null);
  const [userRating, setUserRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);


  const navigate = useNavigate();

  useEffect(() => {


    leoProfanity.loadDictionary("es");
    leoProfanity.add("estupido");
    leoProfanity.add("imbecil");
    leoProfanity.add("coca");
    leoProfanity.add("gonorrea");
    leoProfanity.add("hp");
    leoProfanity.add("hijueputa");
    leoProfanity.add("hijueputas");
    leoProfanity.add("malparido");
    leoProfanity.add("malparida");
    leoProfanity.add("caremondá");
    leoProfanity.add("carechimba");
    leoProfanity.add("careverga");
    leoProfanity.add("marica");
    leoProfanity.add("maricón");
    leoProfanity.add("pirobo");
    leoProfanity.add("piroba");
    leoProfanity.add("guevón");
    leoProfanity.add("guevona");
    leoProfanity.add("mierda");
    leoProfanity.add("mierdero");
    leoProfanity.add("sapo");
    leoProfanity.add("perra");
    leoProfanity.add("puta");
    leoProfanity.add("puto");
    leoProfanity.add("zorra");
    leoProfanity.add("culicagado");
    leoProfanity.add("culicagada");
    leoProfanity.add("careculo");
    leoProfanity.add("caremondongo");
    leoProfanity.add("chimbo");
    leoProfanity.add("cuca");
    leoProfanity.add("verga");
    leoProfanity.add("vergazo");
    leoProfanity.add("pichurria");
    leoProfanity.add("carechimba");
    leoProfanity.add("caremondongo");
    leoProfanity.add("caremonda");
    leoProfanity.add("carepicha");
    leoProfanity.add("carechanda");
    leoProfanity.add("carepuerco");
    leoProfanity.add("cagada");
    leoProfanity.add("cagón");
    leoProfanity.add("cagona");
    leoProfanity.add("culipronta");
    leoProfanity.add("culillo");
    leoProfanity.add("culear");
    leoProfanity.add("culeado");
    leoProfanity.add("culeada");
    leoProfanity.add("jarto");
    leoProfanity.add("lambón");
    leoProfanity.add("lambona");
    leoProfanity.add("lagarto");
    leoProfanity.add("ñero");
    leoProfanity.add("ñera");
    leoProfanity.add("pirobohp");
    leoProfanity.add("piroberta");
    leoProfanity.add("piroberga");
    leoProfanity.add("soplapollas");
    leoProfanity.add("tragahombres");
    leoProfanity.add("tragaperras");
    leoProfanity.add("vulgar");
    leoProfanity.add("vulgarcito");
    leoProfanity.add("boleta");
    leoProfanity.add("arrastrado");
    leoProfanity.add("arrastrada");
    leoProfanity.add("ñanga");
    leoProfanity.add("ñangazo");
    leoProfanity.add("gurrupleta");
    leoProfanity.add("ñongas");
    leoProfanity.add("mocoso");
    leoProfanity.add("mocosa");
    leoProfanity.add("mostacilla");
    leoProfanity.add("vago");
    leoProfanity.add("vaga");
    leoProfanity.add("holgazán");
    leoProfanity.add("holgazana");
    leoProfanity.add("güevas");
    leoProfanity.add("paila");
    leoProfanity.add("boleta");
    leoProfanity.add("chandoso");
    leoProfanity.add("chandosa");
    leoProfanity.add("lambiscon");
    leoProfanity.add("ñamería");
    leoProfanity.add("ñamerías");
    leoProfanity.add("alzado");
    leoProfanity.add("arrastrado");
    leoProfanity.add("barata");
    leoProfanity.add("bobo");
    leoProfanity.add("bobazo");
    leoProfanity.add("burrada");
    leoProfanity.add("burro");
    leoProfanity.add("cafre");
    leoProfanity.add("cansón");
    leoProfanity.add("carepalo");
    leoProfanity.add("caremuela");
    leoProfanity.add("caremuerto");
    leoProfanity.add("careñema");
    leoProfanity.add("carepuerco");
    leoProfanity.add("cascarria");
    leoProfanity.add("chanda");
    leoProfanity.add("chandoso");
    leoProfanity.add("chirrete");
    leoProfanity.add("chismoso");
    leoProfanity.add("chismosa");
    leoProfanity.add("chucha");
    leoProfanity.add("chuchurria");
    leoProfanity.add("cochino");
    leoProfanity.add("cochina");
    leoProfanity.add("corroncho");
    leoProfanity.add("desgraciado");
    leoProfanity.add("desgraciada");
    leoProfanity.add("ebrio");
    leoProfanity.add("flojo");
    leoProfanity.add("gafa");
    leoProfanity.add("gandalla");
    leoProfanity.add("garnupia");
    leoProfanity.add("garrapata");
    leoProfanity.add("gomelo");
    leoProfanity.add("grilla");
    leoProfanity.add("guisa");
    leoProfanity.add("huevón");
    leoProfanity.add("huevona");
    leoProfanity.add("huevonada");
    leoProfanity.add("idiota");
    leoProfanity.add("lagarto");
    leoProfanity.add("loca");
    leoProfanity.add("loco");
    leoProfanity.add("lambón");
    leoProfanity.add("lambona");
    leoProfanity.add("longi");
    leoProfanity.add("locota");
    leoProfanity.add("mamarracho");
    leoProfanity.add("menso");
    leoProfanity.add("mensa");
    leoProfanity.add("mongólico");
    leoProfanity.add("mongólica");
    leoProfanity.add("ñero");
    leoProfanity.add("ñera");
    leoProfanity.add("ñanga");
    leoProfanity.add("paraco");
    leoProfanity.add("pastuso");
    leoProfanity.add("patán");
    leoProfanity.add("patanazo");
    leoProfanity.add("pegao");
    leoProfanity.add("pelmazo");
    leoProfanity.add("pendejo");
    leoProfanity.add("pendeja");
    leoProfanity.add("perezoso");
    leoProfanity.add("perezosa");
    leoProfanity.add("plaga");
    leoProfanity.add("ridículo");
    leoProfanity.add("ridícula");
    leoProfanity.add("sapa");
    leoProfanity.add("sapo hijueputa");
    leoProfanity.add("tarado");
    leoProfanity.add("tarada");
    leoProfanity.add("vago");
    leoProfanity.add("vaga");
    leoProfanity.add("zarrapastroso");
    leoProfanity.add("zarrapastrosa");



  }, []);


  useEffect(() => {
    fetch(`${API_BASE_URL}/api/obras/listaObras`)
      .then(res => res.json())
      .then(data => setAllImages(data || []))
      .catch(err => console.error(err), toast.error("❌ No se pudieron cargar los catálogos"))
      .finally(() => setLoading(false));
  }, []);

  const calcularPromedio = (calificaciones) => {
    if (!calificaciones || calificaciones.length === 0) return 0;
    const total = calificaciones.reduce((sum, c) => sum + parseFloat(c.valor), 0);
    return (total / calificaciones.length).toFixed(1); // un decimal
  };


  const handleLike = async (obraId) => {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }

    setAnimatingLike(obraId);

    try {
      const response = await fetch(`${API_BASE_URL}/api/obras/${obraId}/like`, {
        method: "POST",
        credentials: "include",
      });

      if (!response.ok) return;

      const liked = await response.json(); // boolean

      setAllImages(prev =>
        prev.map(obra => {
          if (obra.id !== obraId) return obra;
          const likesArray = obra.likes || [];
          if (liked && !likesArray.some(l => l.user_name === pseudonimo_user)) {
            return { ...obra, likes: [...likesArray, { user_name: pseudonimo_user }] };
          } else if (!liked) {
            return { ...obra, likes: likesArray.filter(l => l.user_name !== pseudonimo_user) };
          }
          return obra;
        })
      );

      if (selectedObra && selectedObra.id === obraId) {
        const likesArray = selectedObra.likes || [];
        setSelectedObra(prev => {
          if (!prev) return prev;
          if (liked && !likesArray.some(l => l.user_name === pseudonimo_user)) {
            return { ...prev, likes: [...likesArray, { user_name: pseudonimo_user }] };
          } else if (!liked) {
            return { ...prev, likes: likesArray.filter(l => l.user_name !== pseudonimo_user) };
          }
          return prev;
        });
      }

    } catch (error) {
      toast.error("No se pudo hacer la operación")
      console.error(error);
    } finally {

      setTimeout(() => setAnimatingLike(null), 500); // dura la animación
    }
  };



  const handleComment = async (obraId, texto, inputEl) => {
    if (!texto.trim()) return;
    if (!isLoggedIn) { navigate("/login"); return; }

    // Verificar lenguaje inapropiado
    if (leoProfanity.check(texto)) {
      texto = leoProfanity.clean(texto);
      toast.error("Tu comentario contiene lenguaje inapropiado 🚫");
      if (inputEl) inputEl.value = "";
      //return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/obras/${obraId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ texto }),
      });

      if (!response.ok) return;

      const newComment = await response.json();

      setSelectedObra(prev => prev ? { ...prev, comentarios: [...(prev.comentarios || []), newComment] } : prev);

      setAllImages(prev => prev.map(obra =>
        obra.id === obraId
          ? { ...obra, comentarios: [...(obra.comentarios || []), newComment] }
          : obra
      ));

      if (inputEl) inputEl.value = "";
      toast.success("✅ Operación realizada correctamente");
    } catch (error) {
      toast.error("No se pudo hacer la operación")
      console.error(error);
    }
  };


  if (loading) return <div className="galeria-container"><div className="empty">Cargando obras…</div></div>;


  const handleCalification = async (obraId, valor) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/obras/${obraId}/calificacion`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ valor })
      });

      if (!response.ok) { toast.error("No se pudo hacer la operación"); throw new Error("Error al enviar la calificación") }
      setUserRating(valor);

      setSelectedObra(prev => prev ? { ...prev, calificaciones: [...(prev.calificaciones || []), { valor }] } : prev);
      toast.success("✅ Operación realizada correctamente");
    } catch (error) {
      toast.error("No se pudo hacer la operación");
      console.error(error);
    }
  };

  const handleSelectObra = (obra) => {
  setSelectedObra(obra);

  // Buscar calificación previa del usuario
  const calificacionUsuario = obra.calificaciones?.find(
    (c) => c.user_name === pseudonimo_user
  );

  setUserRating(calificacionUsuario ? parseInt(calificacionUsuario.valor) : 0);
};



  return (
    <div className="galeria-container">
      
      <div className="cards">
        {allImages.map(obra => (
          <div className="card" key={obra.id} onClick={() => handleSelectObra(obra)}>
            <img src={obra.link_obra} alt={obra.titulo || obra.id} loading="lazy" />

            <div className="card-info">
              <h4 className="title">{obra.titulo || "Obra"}</h4>
              <p className="author">{obra.autor_name || "Autor desconocido"}</p>
              <p className="rating">
                ⭐ Calificación: {calcularPromedio(obra.calificaciones)}
              </p>


            </div>

            <div className="actions" onClick={e => e.stopPropagation()}>
              <button
                className={`circle-btn ${animatingLike === obra.id ? "anim-heart" : ""}`}
                title="Me gusta"
                onClick={() => handleLike(obra.id)}
              >
                <Heart
                  size={20}
                  color={obra.likes?.some(l => l.user_name === pseudonimo_user) ? "red" : "gray"}
                  fill={obra.likes?.some(l => l.user_name === pseudonimo_user) ? "red" : "none"}
                />
                <span className="count">{Array.isArray(obra.likes) ? obra.likes.length : 0}</span>
              </button>

              <button className="circle-btn">
                <MessageCircle
                  size={20}
                  fill={"blue"} />
                <span className="count">{Array.isArray(obra.comentarios) ? obra.comentarios.length : 0}</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {selectedObra && (
        <div className="modal-overlay" onClick={() => setSelectedObra(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setSelectedObra(null)}><X size={24} /></button>
            <div className="modal-content">
              <div className="modal-left">
                <img src={selectedObra.link_obra} alt={selectedObra.titulo} className="modal-img" />
                <p className="rating">
                  ⭐{calcularPromedio(selectedObra?.calificaciones)}
                </p>
                <div className="star-rating">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span
                      key={star}
                      className={`star ${(hoverRating || userRating) >= star ? 'filled' : ''}`}
                      onClick={() => handleCalification(selectedObra.id, star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                    >
                      ★
                    </span>
                  ))}
                </div>
              </div>
              <div className="modal-right">
                <h2>{selectedObra.titulo}</h2>
                <p className="author">{selectedObra.autor_name}</p>
                <p className="desc">{selectedObra.descripcion}</p>

                <div className="modal-actions">

                  <button className={`circle-btn ${animatingLike === selectedObra.id ? "anim-heart" : ""}`} onClick={() => handleLike(selectedObra.id)}>
                    <Heart size={20} color={selectedObra.likes?.some(l => l.user_name === pseudonimo_user) ? "red" : "gray"} fill={selectedObra.likes?.some(l => l.user_name === pseudonimo_user) ? "red" : "none"} />
                    <span className="count">{Array.isArray(selectedObra.likes) ? selectedObra.likes.length : 0}</span>
                  </button>

                </div>


              </div>
              <div className="modal-comments">
                <div className="comments-list scroll">
                  {selectedObra.comentarios?.map((c, idx) => (
                    <div key={idx} className="comment">
                      <strong>{c.nameUser || "Usuario"}:</strong> {c.texto || c}
                    </div>
                  ))}
                </div>

                <div className="comment-box">
                  <input
                    type="text"
                    placeholder="Añade un comentario..."
                    onKeyDown={e => {
                      if (e.key === "Enter") handleComment(selectedObra.id, e.target.value, e.target);
                    }}
                  />
                  <MessageCircle
                    size={20}
                    className="send-btn"
                    onClick={() => {
                      const input = document.querySelector(".comment-box input");
                      if (input) handleComment(selectedObra.id, input.value, input);
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}
