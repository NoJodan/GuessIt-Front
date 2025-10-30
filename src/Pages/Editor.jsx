import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import juegos from "../modulo json/juegos.json";
import "../styles/editor.css";

function Editor() {
  const { modoId } = useParams();
  const modo = juegos.find((m) => m.id === String(modoId));

  const [objetos, setObjetos] = useState([]);
  const [nuevo, setNuevo] = useState({});

  // 🎵 Referencias de sonido
  const musicaRef = useRef(null);
  const sonidoAddRef = useRef(null);
  const sonidoDelRef = useRef(null);

  // 🎶 Reproduce música de fondo una vez cargado el componente
  useEffect(() => {
    const musica = musicaRef.current;
    musica.volume = 0.3;
    musica.loop = true;
    musica.play().catch(() => {});
  }, []);

  // Carga los objetos iniciales del modo
  useEffect(() => {
    if (modo) setObjetos(modo.objetos || []);
  }, [modo]);

  if (!modo)
    return <p className="gi-error">No se encontró el modo seleccionado. ID: {modoId}</p>;

  // Genera automáticamente los atributos
  const atributos = Object.keys(modo)
    .filter((key) => !["id", "ruta", "objetos"].includes(key))
    .map((key) => ({
      key,
      label: key.charAt(0).toUpperCase() + key.slice(1),
      tipo: "text",
    }));

  // 📥 Controla los cambios en los campos
  const handleChange = (e, key) => setNuevo({ ...nuevo, [key]: e.target.value });

  // ➕ Agrega nuevo objeto con sonido y animación
  const handleAdd = () => {
    if (Object.keys(nuevo).length === 0) return;
    sonidoAddRef.current.currentTime = 0;
    sonidoAddRef.current.play();
    setObjetos([...objetos, { id: Date.now().toString(), ...nuevo }]);
    setNuevo({});
  };

  // ❌ Elimina objeto con efecto sonoro
  const handleDelete = (id) => {
    sonidoDelRef.current.currentTime = 0;
    sonidoDelRef.current.play();
    setObjetos(objetos.filter((obj) => obj.id !== id));
  };

  return (
    <div className="gi-editor">
      {/* 🎵 Elementos de audio */}
      <audio ref={musicaRef} src="/sounds/editor_fondo.mp3" preload="auto" />
      <audio ref={sonidoAddRef} src="/sounds/add_click.mp3" preload="auto" />
      <audio ref={sonidoDelRef} src="/sounds/delete_click.mp3" preload="auto" />

      <h2 className="gi-editor-title">🧩 Editor de {modo.nombre}</h2>

      {/* Formulario dinámico */}
      <div className="gi-form fade-in">
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
        <button className="gi-btn gi-btn-add" onClick={handleAdd}>
          Agregar {modo.nombre}
        </button>
      </div>

      {/* Lista animada */}
      <div className="gi-list">
        {objetos.length > 0 ? (
          objetos.map((obj) => (
            <div key={obj.id} className="gi-list-item fade-up">
              <div>
                {atributos.map((attr) => (
                  <p key={attr.key}>
                    <strong>{attr.label}:</strong> {obj[attr.key]}
                  </p>
                ))}
              </div>
              <button
                className="gi-btn gi-btn-delete"
                onClick={() => handleDelete(obj.id)}
              >
                Eliminar
              </button>
            </div>
          ))
        ) : (
          <p className="fade-in">No hay objetos agregados aún.</p>
        )}
      </div>
    </div>
  );
}

export default Editor;
