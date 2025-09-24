import { Link } from "react-router-dom";
import '../styles/login.css';

function Login() {
  return (
    <div className="login-page">
      <div className="login-card">
        <h2 className="login-title">Iniciar Sesión</h2>

        <form className="login-form">
          <input type="email" placeholder="Correo electrónico" required />
          <input type="password" placeholder="Contraseña" required />
          <button type="submit" className="btn-login">Ingresar</button>
        </form>

        <p className="login-footer">
          ¿No tienes cuenta?{" "}
          <Link to="/signup" className="login-link">Regístrate</Link>
        </p>
      </div>
    </div>

  );
}

export default Login;
