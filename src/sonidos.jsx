import { useEffect } from "react";

function Sonidos() {
  useEffect(() => {
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

    // Limpieza de eventos al desmontar el componente
    return () => {
      elementos.forEach((el) => {
        if (el) el.removeEventListener("mouseenter", reproducirHover);
      });
      if (btnJugar && reproducirClick) {
        btnJugar.removeEventListener("click", reproducirClick);
      }
    };
  }, []);

  return null;
}

export default Sonidos;
