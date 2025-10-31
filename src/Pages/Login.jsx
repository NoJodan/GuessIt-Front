import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import "../styles/login.css";

function Login() {
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");

  const login = async (identifier, password) => {
    try {
      const response = await fetch("https://zooming-integrity-production-6c7d.up.railway.app/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, password }),
      });
      const data = await response.json();
      if (data.token) {
        localStorage.setItem("token", data.token);
      }
      return data;
    } catch (err) {
      return { error: "Error de conexión" };
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = await login(identifier, password);
    if (data && data.token) {
      navigate("/InicioPage");
    } else {
      const msg =
        data?.message ||
        data?.error ||
        JSON.stringify(data) ||
        "Credenciales incorrectas";
      alert(msg);
    }
  };

  return (
    <div className="login-page">
      {/* Header con el logo */}
      <header className="panel-login">
        <Link to="/InicioPage">
          <img
            className="MiniLogo"
            src="/images/mini_logo_nuevo.png"
            alt="Mini logo Guess It!!"
          />
        </Link>
      </header>

      {/* Tarjeta de inicio de sesión */}
      <div className="login-card">
        <h2 className="login-title">Iniciar Sesión</h2>

        <form className="login-form" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Usuario o Correo electrónico"
            required
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
          />
          <input
            type="password"
            placeholder="Contraseña"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit" className="btn-login">
            Ingresar
          </button>
        </form>

        <p className="login-footer">
          ¿No tienes cuenta?{" "}
          <Link to="/signup" className="login-link">
            Regístrate
          </Link>
        </p>
      </div>
    </div>
  );
}
export default Login;
