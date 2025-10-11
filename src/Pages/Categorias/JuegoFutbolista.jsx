import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/juegoFutbolista.css";

export default function JuegoFutbolista() {
  const navigate = useNavigate();

  // Datos locales (puedes ampliar o mover a un JSON)
  const jugadores = [
    {
      id: "messi",
      nombre: "Lionel Messi",
      // si tienes imágenes pon la ruta pública, ejemplo: "/images/messi.jpg"
      imagen: ""
    },  
    {
      id: "ronaldo",
      nombre: "Cristiano Ronaldo",
      imagen: ""
    },
    {
      id: "pele",
      nombre: "Pelé",
      imagen: ""
    }
    // agrega más jugadores aquí
  ];

  const [index, setIndex] = useState(0);
  const [input, setInput] = useState("");
  const [feedback, setFeedback] = useState(null); // 'correct' | 'wrong' | null
  const [score, setScore] = useState(0);

  const jugadorActual = jugadores[index];

  function normalizar(text) {
    return text.trim().toLowerCase();
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!jugadorActual) return;

    const esperado = normalizar(jugadorActual.nombre);
    const respuesta = normalizar(input);

    if (respuesta === esperado) {
      setFeedback("correct");
      setScore((s) => s + 1);
    } else {
      setFeedback("wrong");
    }
  }

  function handleNext() {
    setFeedback(null);
    setInput("");
    if (index < jugadores.length - 1) {
      setIndex(index + 1);
    } else {
      // fin del juego: podrías mostrar una pantalla final o volver al inicio
      // por ahora navegamos a la página de resultados simple
      navigate("/jugar"); // vuelve al listado de juegos
      alert(`Juego terminado. Puntuación: ${score}/${jugadores.length}`);
    }
  }

  return (
    <div className="jf-page">
      <header className="panel-jugar">
        <img className="MiniLogo" src="/images/MiniLogo.png" alt="Mini logo" />
      </header>

      <div className="jf-card">
        <h2 className="jf-title">Adivina el futbolista</h2>

        <div className="jf-content">
          {jugadorActual && jugadorActual.imagen ? (
            <div className="jf-image-wrap">
              <img
                src={jugadorActual.imagen}
                alt={jugadorActual.nombre}
                className="jf-image"
              />
            </div>
          ) : (
            <p className="jf-pista">Adivina el nombre del futbolista</p>
          )}

          <form className="jf-form" onSubmit={handleSubmit}>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Escribe el nombre completo..."
              className="jf-input"
            />
            <button type="submit" className="jf-btn">Probar</button>
          </form>

          {feedback === "correct" && (
            <div className="jf-feedback correct">
              ¡Correcto! Es {jugadorActual.nombre}
            </div>
          )}
          {feedback === "wrong" && (
            <div className="jf-feedback wrong">No es correcto. Intenta otra vez.</div>
          )}

          <div className="jf-controls">
            <button onClick={handleNext} className="jf-next">
              Siguiente
            </button>
            <div className="jf-score">Puntuación: {score}/{jugadores.length}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
