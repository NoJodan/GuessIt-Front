import React, { useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/inicio.css";

function InicioPage() {
  const navigate = useNavigate();
  const bgRef = useRef(null);
  const hoverRef = useRef(null);
  const clickRef = useRef(null);

  useEffect(() => {
    // Inicializa audios y refs
    const bg = new Audio("/sounds/fondo_menu.mp3");
    bg.volume = 0;
    bg.loop = true;
    bgRef.current = bg;

    const hover = new Audio("/sounds/click 1.mp3");
    hover.volume = 0.28;
    hoverRef.current = hover;

    const click = new Audio("/sounds/click 2.mp3");
    click.volume = 0.45;
    clickRef.current = click;

    // Fade-in auditivo
    const startBg = () => {
      bg
        .play()
        .then(() => {
          let v = 0;
          const fade = setInterval(() => {
            if (v < 0.35) {
              v += 0.02;
              bg.volume = v;
            } else clearInterval(fade);
          }, 200);
        })
        .catch((err) => {
          console.warn("🔇 Autoplay bloqueado:", err);
        });
    };

    const timer = setTimeout(startBg, 600);

    // Fade-in visual del body
    document.body.classList.add("fade-in");

    // cleanup
    return () => {
      clearTimeout(timer);
      if (bgRef.current) {
        bgRef.current.pause();
        bgRef.current.currentTime = 0;
      }
      bgRef.current = null;
      hoverRef.current = null;
      clickRef.current = null;
    };
  }, []);

  // hover sound
  const playHover = () => {
    const h = hoverRef.current;
    if (!h) return;
    h.currentTime = 0;
    h.play().catch(() => {});
  };

  // click sound + efecto visual + navegación con pequeño retraso para dejar oír el click
  const handleClickWithSound = (e, to) => {
    const c = clickRef.current;
    if (c) {
      c.currentTime = 0;
      c.play().catch(() => {});
    }

    // efecto "pressed"
    const el = e.currentTarget;
    el.classList.add("pressed");
    setTimeout(() => el.classList.remove("pressed"), 160);

    // si hay ruta (Link) navegamos con un pequeño retraso para dejar sonar el click
    if (to) {
      e.preventDefault(); // evitar navegación inmediata por Link
      setTimeout(() => navigate(to), 170);
    }
  };

  return (
    <div className="ContainerInicio">
      {/* panel superior */}
      <header className="panel-inicio">
        <Link
          to="/Login"
          onMouseOver={playHover}
          onClick={(e) => handleClickWithSound(e, "/Login")}
        >
          <h2 className="btn-panel">Ingresar</h2>
        </Link>

        <Link
          to="/SignUp"
          onMouseOver={playHover}
          onClick={(e) => handleClickWithSound(e, "/SignUp")}
        >
          <h2 className="btn-panel">Registrarse</h2>
        </Link>
      </header>

      {/* logo */}
      <header className="logo-inicio">
        <img
          id="LogoPagina"
          src="/images/mini_logo_nuevo.png"
          alt="Logo de la página"
        />
      </header>

      {/* menu central */}
      <main className="menu-inicio">
        <Link
          to="/Jugar"
          onMouseOver={playHover}
          onClick={(e) => handleClickWithSound(e, "/Jugar")}
        >
          <h2 id="btn-jugar">Jugar</h2>
        </Link>
      </main>

      <footer className="footer-inicio">
        <p>© 2025 Guess It!!</p>
      </footer>
    </div>
  );
}

export default InicioPage;
