import React from 'react'
import '../styles/jugar.css'

function Jugar() {
  return (
    <div className="jugar-page">
      <header className="panel-jugar">
        <img className="MiniLogo" src="/MiniLogo.png" alt="Mini logo Guess It!!" width="500px" height="auto"/>
      </header>
      <div className="jugar-card">
        <h2 className="jugar-title">Modo de Juego</h2>

        <form className="jugar-form">
          <button type="button" className="btn-jugar">Un Jugador</button>
          <button type="button" className="btn-jugar">Dos Jugadores</button>
        </form>

        <p className="jugar-footer">
          ¡Elige tu modo de juego y diviértete!
        </p>
      </div>
    </div>

  )
}

export default Jugar