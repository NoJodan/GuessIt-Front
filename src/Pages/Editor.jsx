import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import juegos from "../modulo json/juegos.json";
import "../styles/editor.css";

function Editor() {
  const { modoId } = useParams();
  const modo = juegos.find((m) => m.id === String(modoId));

  const [objetos, setObjetos] = useState([]);
  const [nuevo, setNuevo] = useState({});

  useEffect(() => {
    if (modo) {
      setObjetos(modo.objetos || []);
    }
  }, [modo]);

  if (!modo) return <p>No se encontró el modo seleccionado. ID: {modoId}</p>;

  // Genera automáticamente los atributos
  const atributos = Object.keys(modo)
    .filter((key) => !["id", "ruta", "objetos"].includes(key))
    .map((key) => ({
      key,
      label: key.charAt(0).toUpperCase() + key.slice(1),
      tipo: "text",
    }));

  const handleChange = (e, key) =>
    setNuevo({ ...nuevo, [key]: e.target.value });
  const handleAdd = () => {
    if (Object.keys(nuevo).length === 0) return;
    setObjetos([...objetos, { id: Date.now().toString(), ...nuevo }]);
    setNuevo({});
  };
  const handleDelete = (id) =>
    setObjetos(objetos.filter((obj) => obj.id !== id));

  return (
    <div className="gi-editor">
      <h2 className="gi-editor-title">Editor de {modo.nombre}</h2>

      <div className="gi-form">
        {atributos.map((attr) => (
          <div key={attr.key} className="gi-form-field">
            <label>{attr.label}</label>
            <input
              type={attr.tipo}
              value={nuevo[attr.key] || ""}
              onChange={(e) => handleChange(e, attr.key)}
            />
          </div>
        ))}
        <button className="gi-btn-add" onClick={handleAdd}>
          Agregar {modo.nombre}
        </button>
      </div>

      <div className="gi-list">
        {objetos.map((obj) => (
          <div key={obj.id} className="gi-list-item">
            <div>
              {atributos.map((attr) => (
                <p key={attr.key}>
                  <strong>{attr.label}:</strong> {obj[attr.key]}
                </p>
              ))}
            </div>
            <button
              className="gi-btn-delete"
              onClick={() => handleDelete(obj.id)}>
              Eliminar
            </button>
          </div>
        ))}
        {objetos.length === 0 && <p>No hay objetos agregados aún.</p>}
      </div>
    </div>
  );
}

export default Editor;
