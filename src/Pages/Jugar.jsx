import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/jugar.css";

function Jugar() {
  const [juegos, setJuegos] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const getAllThemes = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://127.0.0.1:8080/api/game/themes", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();

      if (response.ok) return data.themes;
      throw new Error(data.message || "Error al obtener temáticas");
    } catch (e) {
      throw new Error(e.message || "Error de conexión");
    }
  };

  useEffect(() => {
    (async () => {
      try {
        const temas = await getAllThemes();
        setJuegos(temas.map((t) => ({ id: t.id, nombre: t.name })));
      } catch (e) {
        setError(e.message);
        alert(e.message);
      }
    })();
  }, []);

  return (
    <div className="jugar-page">
      <header className="logo">
        <img
          src="/images/mini_logo_nuevo.png"
          alt="Logo de la página"
          className="logo-img"
        />
      </header>

      <main className="jugar-card">
        <h2 className="jugar-title">Selecciona tu Juego</h2>

        <div className="jugar-form">
          {juegos.map((juego) => (
            <button
              key={juego.id}
              type="button"
              className="btn-jugar"
              onClick={() => {
                localStorage.setItem("selectedThemeId", String(juego.id));
                navigate(`/tema/${juego.id}`);
              }}
            >
              {juego.nombre}
            </button>
          ))}
        </div>

        <p className="jugar-footer">¡Elige un juego y diviértete!</p>
      </main>
    </div>
  );
}

export default Jugar;
