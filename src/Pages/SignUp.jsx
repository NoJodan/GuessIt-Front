import { Link } from "react-router-dom";
import '../styles/signup.css'; // CSS específico de SignUp

function SignUp() {
  return (
    <div className="signup-page">
      <div className="signup-card">
        <h2 className="signup-title">Registrarse</h2>

        <form className="signup-form">
          <input type="text" placeholder="Nombre completo" required />
          <input type="email" placeholder="Correo electrónico" required />
          <input type="password" placeholder="Contraseña" required />
          <input type="password" placeholder="Confirmar contraseña" required />
          <button type="submit" className="btn-signup">Crear cuenta</button>
        </form>

        <p className="signup-footer">
          ¿Ya tienes cuenta?{" "}
          <Link to="/login" className="signup-link">Inicia sesión</Link>
        </p>
      </div>
    </div>
  );
}

export default SignUp;
