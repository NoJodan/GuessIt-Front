import React from "react";
import "../styles/instrucciones.css";
import { useNavigate } from "react-router-dom";

const Instrucciones = () => {
  const navigate = useNavigate();

  const handleStart = () => {
    const juego = JSON.parse(localStorage.getItem("modoSeleccionado"));
    if (!juego) {
      alert("Selecciona un modo de juego primero.");
      return;
    }
    navigate(juego.ruta);
  };

  return (
    <div className="instrucciones-page">
      <div className="instrucciones-panel">
        <img
          src="/images/MiniLogo.png"
          alt="Logo Guess It!!"
          className="instrucciones-logo"
        />
      </div>

      <div className="instrucciones-card">
        <h1 className="instrucciones-title">¡Adivina la Empresa!</h1>
        <p className="instrucciones-text">
          🧩 <strong>Objetivo:</strong> Identifica correctamente la empresa oculta.
          <br /><br />
          💡 Cada pista te acercará más a la respuesta correcta. Analiza bien antes de confirmar tus elecciones.
          <br /><br />
          ✅ Gana si logras adivinar con el menor número de intentos posible.
        </p>

        <button className="btn-iniciar" onClick={handleStart}>
          Iniciar Juego
        </button>
      </div>

      <footer className="instrucciones-footer">
        Versión Beta — Guess It!!
      </footer>
    </div>
  );
};

export default Instrucciones;
