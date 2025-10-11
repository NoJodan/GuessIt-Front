import { useEffect, useState } from "react";

function Sonidos() {
  const [permitirSonido, setPermitirSonido] = useState(false);

  useEffect(() => {
    const habilitarSonido = () => {
      setPermitirSonido(true);
      document.removeEventListener("click", habilitarSonido);
      document.removeEventListener("mousemove", habilitarSonido);
    };

    // Espera la primera interacción del usuario
    document.addEventListener("click", habilitarSonido);
    document.addEventListener("mousemove", habilitarSonido);

    return () => {
      document.removeEventListener("click", habilitarSonido);
      document.removeEventListener("mousemove", habilitarSonido);
    };
  }, []);

  useEffect(() => {
    if (!permitirSonido) return; // ⛔ No activar sonidos aún

    const sonidoHover = new Audio("/sounds/click 1.mp3");
    const sonidoClickJugar = new Audio("/sounds/click al jugar.mp3");

    const reproducirHover = () => {
      sonidoHover.currentTime = 0;
      sonidoHover.play();
    };

    const elementos = [
      document.getElementById("btn-jugar"),
      document.getElementById("ingresar"),
      document.getElementById("registrarse"),
    ];

    elementos.forEach((el) => {
      if (el) el.addEventListener("mouseenter", reproducirHover);
    });

    const btnJugar = document.getElementById("btn-jugar");
    let reproducirClick;
    if (btnJugar) {
      reproducirClick = () => {
        sonidoClickJugar.currentTime = 0;
        sonidoClickJugar.play();
      };
      btnJugar.addEventListener("click", reproducirClick);
    }

    return () => {
      elementos.forEach((el) => {
        if (el) el.removeEventListener("mouseenter", reproducirHover);
      });
      if (btnJugar && reproducirClick) {
        btnJugar.removeEventListener("click", reproducirClick);
      }
    };
  }, [permitirSonido]);

  return null;
}

export default Sonidos;
