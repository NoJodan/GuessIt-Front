import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/jugar.css";

function Jugar() {
  const [juegos, setJuegos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const getAllThemes = async () => {  
    try {  
      const token = localStorage.getItem('token');  
      const response = await fetch('http://127.0.0.1:8080/api/game/themes', {  
        method: 'GET',  
        headers: {  
          'Authorization': `Bearer ${token}`,  
          'Content-Type': 'application/json'  
        }  
      });  
        
      const data = await response.json();  
        
      if (response.ok) {  
        return { success: true, themes: data.themes };  
      } else {  
        return { success: false, error: data.error || data.message || JSON.stringify(data) };  
      }  
    } catch (error) {  
      return { success: false, error: 'Error de conexión' };  
    }  
  };

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      const res = await getAllThemes();
        if (res.success) {
        // Convertir cada tema a un objeto con ruta usando el id
        const temasConRuta = res.themes.map((t) => {
          return { id: t.id, nombre: t.name, ruta: `/tema/${t.id}` };
        });
        setJuegos(temasConRuta);
      } else {
        setJuegos([]);
        setError(res.error || 'No se pudieron obtener las temáticas');
        alert(res.error || 'No se pudieron obtener las temáticas');
      }
      setLoading(false);
    };

    load();
  }, []);

  return (
    <div className="jugar-page">
      <header className="panel-jugar">
        <img
          className="MiniLogo"
          src="/images/MiniLogo.png"
          alt="Mini logo Guess It!!"
          width="500px"
          height="auto"
        />
      </header>

      <div className="jugar-card">
        <h2 className="jugar-title">Selecciona tu Juego</h2>
        <form className="jugar-form">
          {juegos.map((juego) => (
            <button
              key={juego.id}
              type="button"
              className="btn-jugar"
              onClick={() => {
                // guardar id seleccionado para uso posterior y navegar
                try { localStorage.setItem('selectedThemeId', String(juego.id)); } catch (e) {}
                navigate(juego.ruta);
              }}
            >
              {juego.nombre}
            </button>
          ))}
        </form>

        <p className="jugar-footer">¡Elige un juego y diviértete!</p>
      </div>
    </div>
  );
}

export default Jugar;
