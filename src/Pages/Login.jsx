import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import "../styles/login.css";

function Login() {
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");

  const login = async (identifier, password) => {
    try {
      const response = await fetch("http://localhost:8080/auth/login", {
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
      // Inicio de sesión correcto: redirigir a InicioPage
      navigate("/InicioPage");
    } else {
      // Mostrar alerta con el mensaje devuelto por el backend
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
      <header className="panel-login">
        <Link to="/InicioPage">
          <img
            className="MiniLogo"
            src="/images/MiniLogo.png"
            alt="Mini logo Guess It!!"
            width="500px"
            height="auto"
          />
        </Link>
      </header>
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
