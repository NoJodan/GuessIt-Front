import React, { useState, useEffect } from "react";
import futbolistasData from "../../modulo json/futbolistas.json";

function Futbolistas() {
  const [jugadorSeleccionado, setJugadorSeleccionado] = useState(null);
  const [inputUsuario, setInputUsuario] = useState("");
  const [sugerencias, setSugerencias] = useState([]);
  const [resultado, setResultado] = useState({});
  const [mensaje, setMensaje] = useState("");
  const [juegoTerminado, setJuegoTerminado] = useState(false);

  const seleccionarJugadorAleatorio = () => {
    const aleatorio =
      futbolistasData[Math.floor(Math.random() * futbolistasData.length)];
    setJugadorSeleccionado(aleatorio);
    setResultado({});
    setMensaje("");
    setJuegoTerminado(false);
    setInputUsuario("");
    setSugerencias([]);
  };

  useEffect(() => {
    seleccionarJugadorAleatorio();
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

  // Comprobación de intento
  const handleIntento = (e) => {
    e.preventDefault();
    if (!jugadorSeleccionado || juegoTerminado) return;

    const intento = futbolistasData.find(
      (j) => j.nombre.toLowerCase() === inputUsuario.toLowerCase()
    );

    if (!intento) {
      setMensaje("Ese jugador no está en la base de datos 😅");
      setInputUsuario("");
      return;
    }

    const nuevoResultado = {
      champions:
        intento.champions === jugadorSeleccionado.champions ? "verde" : "rojo",
      equipo: intento.equipo === jugadorSeleccionado.equipo ? "verde" : "rojo",
      posicion:
        intento.posicion === jugadorSeleccionado.posicion ? "verde" : "rojo",
      pais: intento.pais === jugadorSeleccionado.pais ? "verde" : "rojo",
      pie: intento.pie === jugadorSeleccionado.pie ? "verde" : "rojo",
    };

    if (intento.nombre === jugadorSeleccionado.nombre) {
      setMensaje(`🎉 ¡Correcto! Era ${jugadorSeleccionado.nombre}`);
      setJuegoTerminado(true);
      setResultado({
        champions: "verde",
        equipo: "verde",
        posicion: "verde",
        pais: "verde",
        pie: "verde",
      });
    } else {
      setMensaje("Sigue intentando...");
      setResultado(nuevoResultado);
    }

    setInputUsuario("");
    setSugerencias([]);
  };

  return (
    <div style={{ textAlign: "center", marginTop: "40px" }}>
      <h1>Adivina el Futbolista</h1>
      {!juegoTerminado && <p>Escribe cualquier nombre para iniciar</p>}

      <form onSubmit={handleIntento} style={{ position: "relative" }}>
        <input
          type="text"
          value={inputUsuario}
          onChange={handleInputChange}
          placeholder="Escribe un jugador"
          disabled={juegoTerminado}
        />
        <button type="submit" disabled={juegoTerminado}>
          Verificar
        </button>

        {/* Autocompletar */}
        {sugerencias.length > 0 && !juegoTerminado && (
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

      {mensaje && <p>{mensaje}</p>}

      {jugadorSeleccionado && (
        <div style={{ marginTop: "20px" }}>
          <h3>Pistas:</h3>
          <ul style={{ listStyle: "none", padding: 0 }}>
            <li style={{ color: resultado.champions === "verde" ? "green" : resultado.champions === "rojo" ? "red" : "black" }}>
              Champions: {jugadorSeleccionado.champions}
            </li>
            <li style={{ color: resultado.equipo === "verde" ? "green" : resultado.equipo === "rojo" ? "red" : "black" }}>
              Equipo actual: {jugadorSeleccionado.equipo}
            </li>
            <li style={{ color: resultado.posicion === "verde" ? "green" : resultado.posicion === "rojo" ? "red" : "black" }}>
              Posición: {jugadorSeleccionado.posicion}
            </li>
            <li style={{ color: resultado.pais === "verde" ? "green" : resultado.pais === "rojo" ? "red" : "black" }}>
              País: {jugadorSeleccionado.pais}
            </li>
            <li style={{ color: resultado.pie === "verde" ? "green" : resultado.pie === "rojo" ? "red" : "black" }}>
              Pie hábil: {jugadorSeleccionado.pie}
            </li>
          </ul>
        </div>
      )}

      {juegoTerminado && (
        <button
          onClick={seleccionarJugadorAleatorio}
          style={{
            marginTop: "20px",
            padding: "10px 20px",
            cursor: "pointer",
            background: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "5px",
          }}
        >
          Volver a intentar
        </button>
      )}
    </div>
  );
}

export default Futbolistas;
