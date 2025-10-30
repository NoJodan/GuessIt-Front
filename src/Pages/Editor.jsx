import React, { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import juegos from "../modulo json/juegos.json";
import "../styles/editor.css";

function Editor() {
  const { modoId } = useParams();
  const modo = juegos.find((m) => m.id === String(modoId));

  const [objetos, setObjetos] = useState([]);
  const [nuevo, setNuevo] = useState({});
  const [muted, setMuted] = useState(false);

  // refs para audios y manejo autoplay bloqueado
  const musicaRef = useRef(null);
  const addRef = useRef(null);
  const delRef = useRef(null);
  const bgBlockedRef = useRef(false);
  const bgStartHandlerRef = useRef(null);

  // --- Inicializar audios (solo una vez) ---
  useEffect(() => {
    // Si prefieres usar elementos <audio> en el DOM ya existentes, puedes,
    // aquí usamos elementos <audio ref=... /> renderizados abajo y los configuramos.
    const bg = musicaRef.current;
    const add = addRef.current;
    const del = delRef.current;

    if (bg) {
      bg.volume = 0;
      bg.loop = true;
    }
    if (add) add.volume = 0.38;
    if (del) del.volume = 0.45;

    // attempt autoplay with fade-in; if blocked attach a one-time user gesture
    const startBg = () => {
      if (!bg) return;
      if (!bg.paused && bg.currentTime > 0) return;
      bg.currentTime = 0;
      bg.volume = 0;
      bg
        .play()
        .then(() => {
          // fade-in until 0.35
          let v = 0;
          const fade = setInterval(() => {
            if (!musicaRef.current) { clearInterval(fade); return; }
            if (v < 0.35) {
              v += 0.02;
              musicaRef.current.volume = Math.min(v, 0.35);
            } else {
              clearInterval(fade);
            }
          }, 160);
          bgBlockedRef.current = false;
        })
        .catch((err) => {
          // autoplay blocked -> start on first user gesture
          bgBlockedRef.current = true;
          const onceStart = () => startBg();
          bgStartHandlerRef.current = onceStart;
          window.addEventListener("pointerdown", onceStart, { once: true });
          window.addEventListener("keydown", onceStart, { once: true });
          console.warn("Autoplay bloqueado, esperando interacción:", err);
        });
    };

    const timer = setTimeout(startBg, 500);

    return () => {
      clearTimeout(timer);
      if (bgStartHandlerRef.current) {
        window.removeEventListener("pointerdown", bgStartHandlerRef.current);
        window.removeEventListener("keydown", bgStartHandlerRef.current);
      }
      // pause audios
      try { if (bg) { bg.pause(); bg.currentTime = 0; } } catch {}
      try { if (add) { add.pause(); add.currentTime = 0; } } catch {}
      try { if (del) { del.pause(); del.currentTime = 0; } } catch {}
    };
  }, []);

  // --- Cargar objetos (localStorage preferido -> JSON fallback) ---
  useEffect(() => {
    if (!modo) return;

    const key = `editor_objects_${modoId}`;
    const stored = localStorage.getItem(key);
    if (stored) {
      try {
        setObjetos(JSON.parse(stored));
        return;
      } catch {}
    }
    // fallback to JSON data (clone to avoid mutating original)
    setObjetos(modo.objetos ? [...modo.objetos] : []);
  }, [modo, modoId]);

  // persistir cuando objetos cambian
  useEffect(() => {
    if (!modo) return;
    const key = `editor_objects_${modoId}`;
    try {
      localStorage.setItem(key, JSON.stringify(objetos));
    } catch {}
  }, [objetos, modoId, modo]);

  if (!modo) return <p className="gi-error">⚠️ No se encontró el modo seleccionado. ID: {modoId}</p>;

  // atributos dinámicos (excluir id, ruta, objetos)
  const atributos = Object.keys(modo)
    .filter((k) => !["id", "ruta", "objetos"].includes(k))
    .map((k) => ({ key: k, label: k.charAt(0).toUpperCase() + k.slice(1), tipo: "text" }));

  const handleChange = (e, key) => setNuevo((n) => ({ ...n, [key]: e.target.value }));

  const handleAdd = () => {
    if (Object.keys(nuevo).length === 0) return;

    // reproducir sonido add si no está muted
    try {
      if (!muted && addRef.current) {
        addRef.current.currentTime = 0;
        addRef.current.play().catch(() => {});
      }
    } catch {}

    setObjetos((prev) => [...prev, { id: Date.now().toString(), ...nuevo }]);
    setNuevo({});
  };

  const handleDelete = (id) => {
    try {
      if (!muted && delRef.current) {
        delRef.current.currentTime = 0;
        delRef.current.play().catch(() => {});
      }
    } catch {}
    setObjetos((prev) => prev.filter((o) => o.id !== id));
  };

  // editar objeto: abre prompts por atributo (simple, sin UI extra)
  const handleEdit = (id) => {
    const obj = objetos.find((o) => o.id === id);
    if (!obj) return;
    const updated = { ...obj };
    for (const attr of atributos) {
      const nuevoVal = window.prompt(`Editar ${attr.label}:`, obj[attr.key] || "");
      if (nuevoVal !== null) updated[attr.key] = nuevoVal;
    }
    setObjetos((prev) => prev.map((o) => (o.id === id ? updated : o)));
  };

  const toggleMute = () => {
    const bg = musicaRef.current;
    setMuted((m) => {
      const next = !m;
      if (bg) bg.muted = next;
      // si bg estaba bloqueado, intentar arrancar
      if (bgBlockedRef.current && bg && bg.paused) {
        bg.play().catch(() => {});
        bgBlockedRef.current = false;
      }
      return next;
    });
  };

  return (
    <div className="editor-container jugar-like">
      {/* Fondo (CSS usa /images/fondo_jugar.jpg) */}
      <div className="editor-background" />

      {/* header centered like Jugar */}
      <header className="editor-header">
        <Link to="/Jugar">
          <img src="/images/mini_logo_nuevo.png" alt="Logo" className="editor-logo" />
        </Link>
        <h1 className="editor-title">Editor — {modo.nombre}</h1>
        <p className="editor-sub">Personaliza los elementos de tu modo</p>
      </header>

      {/* audios controlados por refs (audio tags let browser preload and allow user gesture) */}
      <audio ref={musicaRef} src="/sounds/fondo_menu.mp3" preload="auto" />
      <audio ref={addRef} src="/sounds/click 2.mp3" preload="auto" />
      <audio ref={delRef} src="/sounds/click al jugar.mp3" preload="auto" />

      {/* floating sound toggle */}
      <button className="sound-toggle" onClick={toggleMute} aria-label="toggle sound">
        {muted ? "🔇" : "🔊"}
      </button>

      {/* main centered panel like Jugar */}
      <main className="editor-main jugar-card">
        {/* formulario */}
        <section className="editor-form jugar-form">
          {atributos.map((attr) => (
            <div key={attr.key} className="form-field">
              <label>{attr.label}</label>
              <input
                type={attr.tipo}
                value={nuevo[attr.key] || ""}
                onChange={(e) => handleChange(e, attr.key)}
                placeholder={`Ingrese ${attr.label.toLowerCase()}`}
              />
            </div>
          ))}

          <div style={{ display: "flex", gap: 12, marginTop: 6 }}>
            <button className="btn btn-primary" onClick={handleAdd}>➕ Agregar</button>
            <button
              className="btn btn-secondary"
              onClick={() => {
                // limpiar inputs
                setNuevo({});
                // pequeño sonido opcional
                try {
                  if (!muted && addRef.current) { addRef.current.currentTime = 0; addRef.current.play().catch(() => {}); }
                } catch {}
              }}
            >
              🧹 Limpiar
            </button>
          </div>
        </section>

        {/* lista */}
        <section className="editor-list jugar-card">
          {objetos.length === 0 ? (
            <p className="no-items">No hay objetos agregados aún.</p>
          ) : (
            objetos.map((obj) => (
              <article key={obj.id} className="list-item">
                <div className="item-data">
                  {atributos.map((attr) => <p key={attr.key}><strong>{attr.label}:</strong> {obj[attr.key]}</p>)}
                </div>
                <div className="item-controls">
                  <button className="small-btn" onClick={() => handleEdit(obj.id)} title="Editar">✏️</button>
                  <button className="small-btn danger" onClick={() => handleDelete(obj.id)} title="Eliminar">🗑️</button>
                </div>
              </article>
            ))
          )}
        </section>
      </main>
    </div>
  );
}

export default Editor;
