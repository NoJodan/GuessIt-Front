import React, { useState, useEffect } from "react";
import empresasData from "../../modulo json/empresas.json";

function Empresas() {
  const [empresaSeleccionada, setEmpresaSeleccionada] = useState(null);
  const [inputUsuario, setInputUsuario] = useState("");
  const [sugerencias, setSugerencias] = useState([]);
  const [resultado, setResultado] = useState({});
  const [mensaje, setMensaje] = useState("");
  const [juegoTerminado, setJuegoTerminado] = useState(false);

  const seleccionarEmpresaAleatoria = () => {
    const aleatorio =
      empresasData[Math.floor(Math.random() * empresasData.length)];
    setEmpresaSeleccionada(aleatorio);
    setResultado({});
    setMensaje("");
    setJuegoTerminado(false);
    setInputUsuario("");
    setSugerencias([]);
  };

  useEffect(() => {
    seleccionarEmpresaAleatoria();
  }, []);

  // Autocompletar
  const handleInputChange = (e) => {
    const valor = e.target.value;
    setInputUsuario(valor);

    if (valor.length > 0) {
      const filtrados = empresasData
        .map((e) => e.nombre)
        .filter((nombre) => nombre.toLowerCase().includes(valor.toLowerCase()));
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
    if (!empresaSeleccionada || juegoTerminado) return;

    const intento = empresasData.find(
      (e) => e.nombre.toLowerCase() === inputUsuario.toLowerCase(),
    );

    if (!intento) {
      setMensaje("Esa empresa no está en la base de datos 😅");
      setInputUsuario("");
      return;
    }

    const nuevoResultado = {
      pais: intento.pais === empresaSeleccionada.pais ? "verde" : "rojo",
      industria:
        intento.industria === empresaSeleccionada.industria ? "verde" : "rojo",
      fundacion:
        intento.fundacion === empresaSeleccionada.fundacion ? "verde" : "rojo",
      datoCurioso:
        intento.datoCurioso === empresaSeleccionada.datoCurioso
          ? "verde"
          : "rojo",
    };

    if (intento.nombre === empresaSeleccionada.nombre) {
      setMensaje(`🎉 ¡Correcto! Era ${empresaSeleccionada.nombre}`);
      setJuegoTerminado(true);
      setResultado({
        pais: "verde",
        industria: "verde",
        fundacion: "verde",
        datoCurioso: "verde",
      });
    } else {
      setMensaje("Sigue intentando...");
      setResultado(nuevoResultado);
    }

    setInputUsuario("");
    setSugerencias([]);
  };

  return (
    <div className="empresaPage">
      <div style={{ textAlign: "center", marginTop: "40px" }}>
        <h1>Adivina la Empresa</h1>
        {!juegoTerminado && <p>Escribe cualquier nombre para iniciar</p>}

        <form onSubmit={handleIntento} style={{ position: "relative" }}>
          <input
            type="text"
            value={inputUsuario}
            onChange={handleInputChange}
            placeholder="Escribe una empresa"
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
              }}>
              {sugerencias.map((nombre, i) => (
                <li
                  key={i}
                  onClick={() => handleSugerenciaClick(nombre)}
                  style={{
                    padding: "5px",
                    cursor: "pointer",
                    borderBottom: "1px solid #eee",
                  }}>
                  {nombre}
                </li>
              ))}
            </ul>
          )}
        </form>

        {mensaje && <p>{mensaje}</p>}

        {empresaSeleccionada && (
          <div style={{ marginTop: "20px" }}>
            <h3>Pistas:</h3>
            <ul style={{ listStyle: "none", padding: 0 }}>
              <li
                style={{
                  color:
                    resultado.pais === "verde"
                      ? "green"
                      : resultado.pais === "rojo"
                        ? "red"
                        : "black",
                }}>
                País de origen: {empresaSeleccionada.pais}
              </li>
              <li
                style={{
                  color:
                    resultado.industria === "verde"
                      ? "green"
                      : resultado.industria === "rojo"
                        ? "red"
                        : "black",
                }}>
                Industria: {empresaSeleccionada.industria}
              </li>
              <li
                style={{
                  color:
                    resultado.fundacion === "verde"
                      ? "green"
                      : resultado.fundacion === "rojo"
                        ? "red"
                        : "black",
                }}>
                Año de fundación: {empresaSeleccionada.fundacion}
              </li>
              <li
                style={{
                  color:
                    resultado.datoCurioso === "verde"
                      ? "green"
                      : resultado.datoCurioso === "rojo"
                        ? "red"
                        : "black",
                }}>
                Dato curioso: {empresaSeleccionada.datoCurioso}
              </li>
            </ul>
          </div>
        )}

        {juegoTerminado && (
          <button
            onClick={seleccionarEmpresaAleatoria}
            style={{
              marginTop: "20px",
              padding: "10px 20px",
              cursor: "pointer",
              background: "#007bff",
              color: "white",
              border: "none",
              borderRadius: "5px",
            }}>
            Volver a intentar
          </button>
        )}
      </div>
    </div>
  );
}

export default Empresas;
