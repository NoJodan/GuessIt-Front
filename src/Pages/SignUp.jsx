import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import "../styles/signup.css";

function SignUp() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const register = async (username, email, password) => {
    try {
      const response = await fetch("https://zooming-integrity-production-6c7d.up.railway.app/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await response.json();

      if (response.status === 201) {
        return { success: true, data };
      } else if (response.status === 409) {
        return {
          success: false,
          error: data.error || data.message || "Usuario o correo ya registrado",
        };
      } else if (response.status === 400) {
        return { success: false, errors: data };
      } else {
        return {
          success: false,
          error: data.error || data.message || JSON.stringify(data),
        };
      }
    } catch (error) {
      return { success: false, error: "Error de conexión" };
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Las contraseñas no coinciden");
      return;
    }

    const result = await register(username, email, password);
    if (result.success) {
      alert(result.data?.message || "Registro exitoso");
      navigate("/InicioPage");
    } else {
      if (result.error) {
        alert(result.error);
      } else if (result.errors) {
        const errs =
          typeof result.errors === "string"
            ? result.errors
            : JSON.stringify(result.errors);
        alert(errs);
      } else {
        alert("Error en el registro");
      }
    }
  };

  return (
    <div className="signup-page">
      {/* Fondo con desenfoque animado */}
      <div className="background"></div>

      {/* Logo superior */}
      <header className="panel-login">
        <Link to="/InicioPage">
          <img
            className="MiniLogo"
            src="/images/mini_logo_nuevo.png"
            alt="Mini logo Guess It!!"
          />
        </Link>
      </header>

      {/* Tarjeta central */}
      <div className="signup-card container">
        <h2 className="signup-title title">Registrarse</h2>

        <form className="signup-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Usuario</label>
            <input
              type="text"
              placeholder="Ingresa tu usuario"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="input-group">
            <label>Correo electrónico</label>
            <input
              type="email"
              placeholder="ejemplo@correo.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="input-group">
            <label>Contraseña</label>
            <input
              type="password"
              placeholder="Contraseña"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="input-group">
            <label>Confirmar contraseña</label>
            <input
              type="password"
              placeholder="Repite tu contraseña"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <button type="submit" className="btn btn-signup">
            Crear cuenta
          </button>
        </form>

        <p className="signup-footer register-text">
          ¿Ya tienes cuenta?{" "}
          <Link to="/login" className="signup-link">
            Inicia sesión
          </Link>
        </p>
      </div>
    </div>
  );
}

export default SignUp;
