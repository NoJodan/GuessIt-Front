import { Link, useNavigate } from "react-router-dom";
import { useState } from 'react';
import '../styles/signup.css'; // CSS específico de SignUp

function SignUp() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const register = async (username, email, password) => {  
    try {  
      const response = await fetch('http://localhost:8080/auth/register', {  
        method: 'POST',  
        headers: { 'Content-Type': 'application/json' },  
        body: JSON.stringify({ username, email, password })  
      });  
        
      const data = await response.json();  
        
      if (response.status === 201) {  
        // Registro exitoso  
        return { success: true, data };  
      } else if (response.status === 409) {  
        // Conflicto: usuario o email ya existe  
        return { success: false, error: data.error || data.message || 'Conflicto' };  
      } else if (response.status === 400) {  
        // Errores de validación  
        return { success: false, errors: data };  
      } else {
        return { success: false, error: data.error || data.message || JSON.stringify(data) };
      }
    } catch (error) {  
      return { success: false, error: 'Error de conexión' };  
    }  
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert('Las contraseñas no coinciden');
      return;
    }
    const result = await register(username, email, password);
    if (result.success) {
      // Registro correcto: mostrar mensaje y redirigir
      const message = result.data?.message || 'Registro exitoso';
      alert(message);
      navigate('/InicioPage');
    } else {
      // Mostrar alert con detalles
      if (result.error) {
        alert(result.error);
      } else if (result.errors) {
        // errors puede ser un objeto con múltiples mensajes
        const errs = typeof result.errors === 'string' ? result.errors : JSON.stringify(result.errors);
        alert(errs);
      } else {
        alert('Error en el registro');
      }
    }
  };

  return (
    <div className="signup-page">
      <header className="panel-login">
        <Link to="/InicioPage">
          <img className="MiniLogo" src="/images/MiniLogo.png" alt="Mini logo Guess It!!" width="500px" height="auto"/>
        </Link>
      </header>
      <div className="signup-card">
        <h2 className="signup-title">Registrarse</h2>
        <form className="signup-form" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Usuario"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="email"
            placeholder="Correo electrónico"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Contraseña"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <input
            type="password"
            placeholder="Confirmar contraseña"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
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
