import React, {useState, useEffect } from 'react'
import juegosConfig from "../modulo json/juegos.json";
import '../styles/jugar.css'

function Jugar() {
  // Inicializa el estado 'juegos' con un array vacío.
  // Al montar el componente, se carga la configuración desde el JSON usando useEffect, 
  // recordar se implemento el json para la configuracion de los juegos
  // y se actualiza el estado 'juegos' con los datos importados.
  // Esto permite que el componente tenga acceso a la lista de juegos para renderizarlos dinámicamente.
  const [juegos, setJuegos] = useState([]);
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
              onClick={() => alert(`Entrar a ${juego.nombre}`)}
            >
              {juego.nombre}
            </button>
          ))}
        </form>

        <p className="jugar-footer">
          ¡Elige un juego y diviértete!
        </p>
      </div>
    </div>
  );
}

export default Jugar;