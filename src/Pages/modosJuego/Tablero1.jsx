import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import atributosData from "../../modulo_json/juegos.json";
import '../../styles/tablero1.css';

const Tablero1 = () => {
  const { id } = useParams(); // el id del juego: "empresa", "ciudad", etc.
  const [atributos, setAtributos] = useState([]);
  const [respuestas, setRespuestas] = useState({});
  const [resultado, setResultado] = useState({});
  const [bloqueado, setBloqueado] = useState(false);

  useEffect(() => {
    if (atributosData[id]) {
      setAtributos(atributosData[id]);
    } else {
      setAtributos([]);
    }
  }, [id]);

  const handleSelect = (atributoId, valor) => {
    if (bloqueado) return;
    setRespuestas({ ...respuestas, [atributoId]: valor });
  };

  const comprobarRespuestas = () => {
    const nuevoResultado = {};
    atributos.forEach((atr) => {
      nuevoResultado[atr.id] = respuestas[atr.id] === atr.correcta;
    });
    setResultado(nuevoResultado);
    setBloqueado(true);
  };

  return (
    <div className="tablero-page">
      <div className="panel-tablero">
        <h1 className="titulo-tablero">Adivina: {id?.toUpperCase()}</h1>
      </div>

      <div className="zona-pentagonos">
        {atributos.map((atr, i) => (
          <div
            key={atr.id}
            className={`bloque-atributo ${
              resultado[atr.id] === true
                ? "correcto"
                : resultado[atr.id] === false
                ? "incorrecto"
                : ""
            }`}
            style={{
              transform: `translateY(${i % 2 === 0 ? "-15px" : "15px"})`,
            }}
          >
            <select
              className="select-atributo"
              onChange={(e) => handleSelect(atr.id, e.target.value)}
              disabled={bloqueado}
              defaultValue=""
            >
              <option value="">Selecciona...</option>
              {atr.opciones.map((op) => (
                <option key={op} value={op}>
                  {op}
                </option>
              ))}
            </select>

            <div className="pentagono">{atr.nombre}</div>
          </div>
        ))}
      </div>

      <button
        className="btn-comprobar"
        onClick={comprobarRespuestas}
        disabled={bloqueado}
      >
        Comprobar respuestas
      </button>
    </div>
  );
};

export default Tablero1;
