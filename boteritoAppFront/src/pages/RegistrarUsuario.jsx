import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./RegistrarUsuario.css";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function Register() {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showDatosModal, setShowDatosModal] = useState(false);
  const [showTerminosModal, setShowTerminosModal] = useState(false);

  // 🔹 Estados para los checkboxes
  const [checkbox1, setCheckbox1] = useState(false);
  const [checkbox2, setCheckbox2] = useState(false);

  const navigate = useNavigate();

  // 🔹 Calcular fecha máxima (mínimo 12 años)
  const today = new Date();
  const maxDate = new Date(
    today.getFullYear() - 12,
    today.getMonth(),
    today.getDate()
  )
    .toISOString()
    .split("T")[0];

  // Validar la contraseña
  const validatePassword = (password) => {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&._-])[A-Za-z\d@$!%*?&._-]{8,}$/;

    if (!passwordRegex.test(password)) {
      setPasswordError(
        "La contraseña debe tener mínimo 8 caracteres, incluir una mayúscula, una minúscula, un número y un carácter especial."
      );
    } else {
      setPasswordError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const nombre = e.target.nombre.value.trim();
    const pseudonimo = e.target.pseudonimo.value.trim();
    const email = e.target.email.value.trim();
    const password = e.target.password.value.trim();
    const confirmPassword = e.target.confirmPassword.value.trim();
    const fecha_nacimiento = e.target.fecha_nacimiento.value;

    // 🔹 Validación de checkboxes
    if (!checkbox1 || !checkbox2) {
      setError("⚠️ Debes aceptar nuestras políticas y condiciones para registrarte.");
      setSuccess("");
      return;
    }

    if (
      !nombre ||
      !pseudonimo ||
      !email ||
      !password ||
      !confirmPassword ||
      !fecha_nacimiento
    ) {
      setError("Por favor, completa todos los campos.");
      setSuccess("");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("El correo electrónico no tiene un formato válido.");
      setSuccess("");
      return;
    }

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&._-])[A-Za-z\d@$!%*?&._-]{8,}$/;
    if (!passwordRegex.test(password)) {
      setError("La contraseña no cumple con los requisitos de seguridad.");
      setSuccess("");
      return;
    }

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      setSuccess("");
      return;
    }

    setError("");
    setSuccess("");

    try {
      const response = await fetch(`${API_BASE_URL}/api/usuarios/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre,
          pseudonimo,
          email,
          password,
          roles_id: "689bd2e00691edc2fc5831fd",
          fecha_nacimiento,
        }),
      });

      if (!response.ok) {
        const errorMsg = await response.text();
        setError(errorMsg);
        setSuccess("");
        return;
      }

      const data = await response.json();
      setSuccess("✅ Usuario creado: " + data.email);
      alert("Registro exitoso ✅");
      e.target.reset();
      setCheckbox1(false);
      setCheckbox2(false);
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (error) {
      console.error("Error en el registro:", error);
      setError("Ocurrió un error en el servidor.");
    }
  };

  // Limpiar el error cuando el usuario marque ambos checkbox
  const handleCheckbox1 = (checked) => {
    setCheckbox1(checked);
    if (checked && checkbox2) setError("");
  };
  const handleCheckbox2 = (checked) => {
    setCheckbox2(checked);
    if (checked && checkbox1) setError("");
  };

  return (
    <div className="register-page">
      <div className="overlay"></div>

      <div className="register-container">
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        <h2 className="title">Registrarse</h2>

        <form className="register-form" onSubmit={handleSubmit}>
          <input type="text" name="nombre" placeholder="Nombre" />
          <input
            type="email"
            name="email"
            placeholder="Email"
            required
            pattern="^[^\s@]+@[^\s@]+\.[^\s@]+$"
             onChange={(e) => {
    e.target.value = e.target.value.toLowerCase();
  }}
          />
          <input type="text" name="pseudonimo" placeholder="Pseudonimo" />

          {/* Campo de fecha bonito */}
          <div className="form-group">
            <label htmlFor="fecha_nacimiento">Fecha de nacimiento</label>
            <input
              type="date"
              name="fecha_nacimiento"
              id="fecha_nacimiento"
              max={maxDate}
              required
            />
           
          </div>

          <input
            type="password"
            name="password"
            placeholder="Contraseña"
            onBlur={(e) => validatePassword(e.target.value)}
          />
          {passwordError && <p className="error-message">{passwordError}</p>}

          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirmar Contraseña"
          />

          {/* Checkboxes con links */}
          <div className="checkbox-container">
            <label>
              <input
                type="checkbox"
                checked={checkbox1}
                onChange={(e) => handleCheckbox1(e.target.checked)}
              />{" "}
              Autorizo de manera libre, previa, expresa e informada que mis datos
              personales sean recogidos a través de este software. Para ejercer
              estos derechos o para conocer la política de tratamiento de datos
              personales, podrá acceder a ellos a través del siguiente{" "}
              <span className="link" onClick={() => setShowDatosModal(true)}>
                link
              </span>
              .
            </label>
          </div>

          <div className="checkbox-container">
            <label>
              <input
                type="checkbox"
                checked={checkbox2}
                onChange={(e) => handleCheckbox2(e.target.checked)}
              />{" "}
              Acepto los términos y condiciones de uso de la aplicación,
              comprometiéndome a hacer un uso adecuado, responsable y conforme
              del producto de software. Podrá acceder a ellos a través del
              siguiente{" "}
              <span className="link" onClick={() => setShowTerminosModal(true)}>
                link
              </span>
              .
            </label>
          </div>

          <button type="submit" className="btn-submit">
            Registrarme
          </button>
        </form>

        <p className="login-link">
          ¿Ya tienes una cuenta? <a href="/login">Iniciar Sesión</a>
        </p>
      </div>

      {/* Modal Tratamiento de Datos */}
      {showDatosModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>TRATAMIENTO DE DATOS PERSONALES</h3>
            <p>
              El tratamiento de los datos personales se realizará atendiendo los
              principios de legalidad, finalidad, libertad, veracidad o calidad,
              transparencia, acceso y circulación restringida, seguridad y
              confidencialidad, en cumplimiento de la Ley 1581 de 2012, el
              Decreto 1377 de 2013 y demás normas que regulan la protección de
              datos en Colombia.
            </p>
            <p>El titular de los datos personales tiene derecho a:</p>
            <ul>
              <li>
                Conocer, actualizar, rectificar, suprimir sus datos y revocar la
                autorización otorgada para su tratamiento.
              </li>
              <li>Solicitar prueba de la autorización otorgada.</li>
              <li>
                Ser informado respecto al uso que se le ha dado a sus datos
                personales.
              </li>
              <li>
                Presentar quejas ante la Superintendencia de Industria y
                Comercio por infracciones a lo dispuesto en la ley.
              </li>
            </ul>
            <p>
              La entrega de datos sensibles o de menores de edad es facultativa,
              así como la respuesta a las preguntas que versen sobre estos
              datos. La autorización y tratamiento de los datos personales será
              conservada de manera segura, garantizando su protección y uso
              adecuado conforme a la normativa vigente.
            </p>
            <button onClick={() => setShowDatosModal(false)}>Cerrar</button>
          </div>
        </div>
      )}

      {/* Modal Términos y Condiciones */}
      {showTerminosModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>TÉRMINOS Y CONDICIONES DE USO</h3>
            <p>
              Al acceder y utilizar esta aplicación, el usuario acepta cumplir
              con los presentes términos y condiciones de uso. El uso de este
              producto de software implica la aceptación íntegra de todas sus
              disposiciones, políticas y restricciones. Si no está de acuerdo con
              alguna de las condiciones aquí expuestas, por favor absténgase de
              utilizar la aplicación.
            </p>
            <p>
              El propietario del producto de software se reserva el derecho de
              modificar, actualizar o eliminar en cualquier momento los términos
              y condiciones, así como las funcionalidades del servicio ofrecido,
              sin previo aviso. Es responsabilidad del usuario revisar
              periódicamente estos términos para estar informado de posibles
              cambios.
            </p>
            <p>
              El usuario se compromete a hacer un uso adecuado del software,
              conforme a la ley, la moral, el orden público y las buenas
              costumbres, y se abstendrá de emplearlo para realizar actividades
              ilícitas o que infrinjan derechos de terceros.
            </p>
            <p>
              El propietario no se hace responsable por daños directos o
              indirectos, pérdidas de información, interrupciones del servicio o
              cualquier consecuencia derivada del uso o imposibilidad de uso de
              la aplicación por parte del usuario.
            </p>
            <p>
              El acceso y utilización de ciertas funcionalidades pueden requerir
              la aceptación de políticas adicionales, como la de tratamiento de
              datos personales, la cuales también deben ser leída y aceptada por
              el usuario.
            </p>
            <button onClick={() => setShowTerminosModal(false)}>Cerrar</button>
          </div>
        </div>
      )}
    </div>
  );
}
