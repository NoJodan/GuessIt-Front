import { useEffect, useState } from "react";

function Sonidos() {
  const [permitirSonido, setPermitirSonido] = useState(false);

  useEffect(() => {
    const habilitarSonido = () => {
      setPermitirSonido(true);
      document.removeEventListener("click", habilitarSonido);
      document.removeEventListener("mousemove", habilitarSonido);
    };

    document.addEventListener("click", habilitarSonido);
    document.addEventListener("mousemove", habilitarSonido);

    return () => {
      document.removeEventListener("click", habilitarSonido);
      document.removeEventListener("mousemove", habilitarSonido);
    };
  }, []);

  useEffect(() => {
    if (!permitirSonido) return;

    const reproducirHover = () => {
      const sonidoHover = new Audio("/sounds/click 1.mp3");
      sonidoHover.currentTime = 0;
      sonidoHover.play().catch(() => {});
    };

    const reproducirClick = () => {
      const sonidoClickJugar = new Audio("/sounds/click al jugar.mp3");
      sonidoClickJugar.currentTime = 0;
      sonidoClickJugar.play().catch(() => {});
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
    if (btnJugar) btnJugar.addEventListener("click", reproducirClick);

    return () => {
      elementos.forEach((el) => {
        if (el) el.removeEventListener("mouseenter", reproducirHover);
      });
      if (btnJugar) btnJugar.removeEventListener("click", reproducirClick);
    };
  }, [permitirSonido]);

  return null;
}

export default Sonidos;
