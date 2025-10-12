import React, { useState, useEffect } from "react";
import futbolistasData from "../../modulo json/futbolistas.json";

function Futbolistas() {
  const [jugadorSeleccionado, setJugadorSeleccionado] = useState(null); // jugador aleatorio
  const [inputUsuario, setInputUsuario] = useState("");                 // input donde escribe
  const [resultado, setResultado] = useState([]);                       // colores de pistas
  const [sugerencias, setSugerencias] = useState([]);                   // autocompletar

  // Al montar el componente, seleccionar jugador aleatorio
  useEffect(() => {
    const aleatorio =
      futbolistasData[Math.floor(Math.random() * futbolistasData.length)];
    setJugadorSeleccionado(aleatorio);
    setResultado(Array(aleatorio.pistas.length).fill("neutral"));
  }, []);

  // Autocompletar
  const handleInputChange = (e) => {
    const valor = e.target.value;
    setInputUsuario(valor);

    if (valor.length > 0) {
      const filtrados = futbolistasData
        .map((j) => j.nombre)
        .filter((nombre) =>
          nombre.toLowerCase().includes(valor.toLowerCase())
        );
      setSugerencias(filtrados);
    } else {
      setSugerencias([]);
    }
  };

  const handleSugerenciaClick = (nombre) => {
    setInputUsuario(nombre);
    setSugerencias([]);
  };

  // Intento del usuario
  const handleIntento = (e) => {
    e.preventDefault();
    if (!jugadorSeleccionado) return;

    const nuevoResultado = jugadorSeleccionado.pistas.map((pista) => {
      return pista.toLowerCase().includes(inputUsuario.toLowerCase())
        ? "verde"
        : "rojo";
    });

    // Si el usuario adivina correctamente el jugador, todas las pistas en verde
    if (inputUsuario.toLowerCase() === jugadorSeleccionado.nombre.toLowerCase()) {
      setResultado(Array(jugadorSeleccionado.pistas.length).fill("verde"));
      alert(`¡Correcto! El jugador era ${jugadorSeleccionado.nombre}`);
    } else {
      setResultado(nuevoResultado);
    }

    setInputUsuario("");
    setSugerencias([]);
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Adivina el Futbolista</h1>
      <p>Escribe cualquier nombre para empezar a adivinar</p>

      <form onSubmit={handleIntento} style={{ position: "relative" }}>
        <input
          type="text"
          value={inputUsuario}
          onChange={handleInputChange}
          placeholder="Escribe tu intento"
        />
        <button type="submit">Verificar</button>

        {/* Autocompletar */}
        {sugerencias.length > 0 && (
          <ul
            style={{
              position: "absolute",
              background: "white",
              border: "1px solid #ccc",
              listStyle: "none",
              padding: 0,
              margin: 0,
              width: "200px",
              maxHeight: "150px",
              overflowY: "auto",
              zIndex: 10,
            }}
          >
            {sugerencias.map((nombre, i) => (
              <li
                key={i}
                onClick={() => handleSugerenciaClick(nombre)}
                style={{
                  padding: "5px",
                  cursor: "pointer",
                  borderBottom: "1px solid #eee",
                }}
              >
                {nombre}
              </li>
            ))}
          </ul>
        )}
      </form>

      {jugadorSeleccionado && (
        <>
          <h3>Pistas:</h3>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {jugadorSeleccionado.pistas.map((pista, index) => (
              <li
                key={index}
                style={{
                  color:
                    resultado[index] === "verde"
                      ? "green"
                      : resultado[index] === "rojo"
                      ? "red"
                      : "black",
                  margin: "5px 0",
                }}
              >
                {pista}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

export default Futbolistas;
