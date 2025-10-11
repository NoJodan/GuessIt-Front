import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import juegosConfig from "../modulo json/juegos.json";
import "../styles/jugar.css";

function Jugar() {
  const [juegos, setJuegos] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    setJuegos(juegosConfig);
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
              onClick={() => navigate(juego.ruta)}
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
