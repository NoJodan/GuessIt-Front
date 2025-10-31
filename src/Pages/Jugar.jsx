import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/jugar.css";

function Jugar() {
  const [juegos, setJuegos] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Referencias de audio
  const bgMusicRef = useRef(null);
  const hoverSoundRef = useRef(null);
  const clickSoundRef = useRef(null);

  // === FUNCIÓN PARA OBTENER TEMAS DESDE EL BACKEND ===
  const getAllThemes = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("https://zooming-integrity-production-6c7d.up.railway.app/api/game/themes", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();

      if (response.ok) return data.themes;
      throw new Error(data.message || "Error al obtener temáticas");
    } catch (e) {
      throw new Error(e.message || "Error de conexión");
    }
  };

  // === CARGA INICIAL ===
  useEffect(() => {
    // Fade visual al cargar
    document.body.classList.add("fade-in");

    // Reproducir música de fondo con fade-in
    const bgMusic = bgMusicRef.current;
    if (bgMusic) {
      bgMusic.volume = 0;
      bgMusic.loop = true;

      setTimeout(() => {
        bgMusic
          .play()
          .then(() => {
            let v = 0;
            const fade = setInterval(() => {
              if (v < 0.4) {
                v += 0.02;
                bgMusic.volume = v;
              } else clearInterval(fade);
            }, 200);
          })
          .catch((err) => {
            console.warn("🎧 Bloqueo de autoplay:", err);
          });
      }, 800);
    }

    // Cargar juegos desde el backend
    (async () => {
      try {
        const temas = await getAllThemes();
        setJuegos(temas.map((t) => ({ id: t.id, nombre: t.name })));
      } catch (e) {
        setError(e.message);
        alert(e.message);
      }
    })();

    return () => {
      if (bgMusic) bgMusic.pause();
    };
  }, []);

  // === MANEJAR CLIC EN BOTONES ===
  const handleClick = (id) => {
    const bgMusic = bgMusicRef.current;
    const clickSound = clickSoundRef.current;

    // Pausar fondo y reproducir clic
    if (bgMusic) bgMusic.pause();
    if (clickSound) {
      clickSound.currentTime = 0;
      clickSound.play().catch(() => {});
    }

    // Fade-out visual antes de navegar
    document.body.style.transition = "opacity 2s";
    document.body.style.opacity = 0;

    setTimeout(() => {
      localStorage.setItem("selectedThemeId", String(id));
      navigate(`/tema/${id}`);
    }, 2000);
  };

  // === MANEJAR HOVER EN BOTONES ===
  const handleHover = () => {
    const hoverSound = hoverSoundRef.current;
    if (hoverSound) {
      hoverSound.currentTime = 0;
      hoverSound.play().catch(() => {});
    }
  };

  return (
    <div className="jugar-page">
      <header className="panel-jugar">
        <img
          className="MiniLogo"
          src="/images/mini_logo_nuevo.png"
          alt="Mini logo Guess It!!"
          width="400"
          height="auto"
        />
      </header>

      <main>
        <h2 className="jugar-title">Selecciona tu Juego</h2>

        <div id="jugar-container" className="jugar-container">
          <div id="jugar-form" className="jugar-form">
            {error && (
              <p style={{ color: "#ff8c8c" }}>
                No se pudieron cargar las categorías.
              </p>
            )}
            {!error && juegos.length === 0 && (
              <p style={{ color: "#bfa76f" }}>Cargando categorías...</p>
            )}
            {juegos.map((juego, index) => (
              <button
                key={juego.id}
                type="button"
                className="btn-jugar"
                id={`btn-jugar-${index}`}
                onMouseOver={handleHover}
                onClick={() => handleClick(juego.id)}
              >
                {juego.nombre}
              </button>
            ))}
          </div>
        </div>

        <p className="jugar-footer">¡Elige un juego y diviértete!</p>
      </main>

      {/* === AUDIOS === */}
      <audio ref={bgMusicRef} id="bg-music" src="/sounds/fondo_menu.mp3" loop />
      <audio ref={hoverSoundRef} src="/sounds/hover.mp3" />
      <audio ref={clickSoundRef} src="/sounds/click.mp3" />
    </div>
  );
}

export default Jugar;
