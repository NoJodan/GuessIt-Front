import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import juegos from "../modulo json/juegos.json";
import "../styles/editor.css";

function Editor() {
  const { modoId } = useParams();
  const modo = juegos.find((m) => m.id === String(modoId));

  const [objetos, setObjetos] = useState([]);
  const [nuevo, setNuevo] = useState({});
  const [muted, setMuted] = useState(false);

  // 🎧 Refs de sonido
  const musicaRef = useRef(null);
  const addRef = useRef(null);
  const delRef = useRef(null);

  // ▶️ Música de fondo automática
  useEffect(() => {
    const musica = musicaRef.current;
    musica.volume = 0.3;
    musica.loop = true;
    musica.play().catch(() => {});
  }, []);

  useEffect(() => {
    if (modo) setObjetos(modo.objetos || []);
  }, [modo]);

  if (!modo)
    return <p className="gi-error">⚠️ No se encontró el modo seleccionado.</p>;

  const atributos = Object.keys(modo)
    .filter((key) => !["id", "ruta", "objetos"].includes(key))
    .map((key) => ({
      key,
      label: key.charAt(0).toUpperCase() + key.slice(1),
      tipo: "text",
    }));

  const handleChange = (e, key) => setNuevo({ ...nuevo, [key]: e.target.value });

  const handleAdd = () => {
    if (Object.keys(nuevo).length === 0) return;
    if (!muted) {
      addRef.current.currentTime = 0;
      addRef.current.play();
    }
    setObjetos([...objetos, { id: Date.now().toString(), ...nuevo }]);
    setNuevo({});
  };

  const handleDelete = (id) => {
    if (!muted) {
      delRef.current.currentTime = 0;
      delRef.current.play();
    }
    setObjetos(objetos.filter((obj) => obj.id !== id));
  };

  const toggleMute = () => {
    const musica = musicaRef.current;
    setMuted(!muted);
    musica.muted = !musica.muted;
  };

  return (
    <div className="editor-container">
      {/* 🎵 Sonidos */}
      <audio ref={musicaRef} src="/sounds/fondo_menu.mp3" preload="auto" />
      <audio ref={addRef} src="/sounds/click 2.mp3" preload="auto" />
      <audio ref={delRef} src="/sounds/click al jugar.mp3" preload="auto" />

      {/* 🔊 Control flotante de sonido */}
      <div className="sound-toggle" onClick={toggleMute}>
        {muted ? "🔇" : "🎶"}
      </div>

      <div className="editor-header fade-down">
        <h1>🧠 Editor de {modo.nombre}</h1>
        <p>Personaliza los elementos y experimenta tu modo de juego.</p>
      </div>

      <div className="editor-panel fade-up">
        {atributos.map((attr) => (
          <div key={attr.key} className="editor-field">
            <label>{attr.label}</label>
            <input
              type={attr.tipo}
              value={nuevo[attr.key] || ""}
              onChange={(e) => handleChange(e, attr.key)}
              placeholder={`Ingrese ${attr.label.toLowerCase()}`}
            />
          </div>
        ))}
        <button className="btn add" onClick={handleAdd}>
          + Agregar {modo.nombre}
        </button>
      </div>

      <div className="editor-list">
        {objetos.length > 0 ? (
          objetos.map((obj) => (
            <div key={obj.id} className="editor-card fade-in">
              <div className="card-content">
                {atributos.map((attr) => (
                  <p key={attr.key}>
                    <strong>{attr.label}:</strong> {obj[attr.key]}
                  </p>
                ))}
              </div>
              <button className="btn delete" onClick={() => handleDelete(obj.id)}>
                ✖
              </button>
            </div>
          ))
        ) : (
          <p className="no-items fade-in">No hay objetos aún.</p>
        )}
      </div>
    </div>
  );
}

export default Editor;
