import React, { useEffect, useState } from "react";
import juegosData from "../modulo json/juegos.json";
import "../styles/admin.css";
import Jugar from "../Pages/Jugar";
import Sonidos from "../sonidos"; // 🎵 sistema de sonidos centralizado

const Admin = () => {
  const [activeTab, setActiveTab] = useState("admin");
  const [groups, setGroups] = useState([]);
  const [expandedGroup, setExpandedGroup] = useState(null);
  const [hoverSound, setHoverSound] = useState(null);
  const [clickSound, setClickSound] = useState(null);
  const [bgMusic, setBgMusic] = useState(null);

  /* ----------------- EFECTOS DE SONIDO ----------------- */
  useEffect(() => {
    const hover = new Audio("/sounds/click 1.mp3");
    const click = new Audio("/sounds/click 2.mp3");
    const bg = new Audio("/sounds/fondo_menu.mp3");

    hover.volume = 0.4;
    click.volume = 0.5;
    bg.volume = 0.2;
    bg.loop = true;

    setHoverSound(hover);
    setClickSound(click);
    setBgMusic(bg);

    bg.play().catch(() => {
      console.log("🎧 Música en espera de interacción del usuario.");
    });

    return () => {
      bg.pause();
      bg.currentTime = 0;
    };
  }, []);

  const playHover = () => hoverSound && hoverSound.play();
  const playClick = () => clickSound && clickSound.play();

  /* ----------------- CARGA DE JSON ----------------- */
  useEffect(() => {
    let loaded = [];
    if (Array.isArray(juegosData)) loaded = juegosData;
    else if (Array.isArray(juegosData.modos)) loaded = juegosData.modos;
    else if (Array.isArray(juegosData.modulos)) loaded = juegosData.modulos;
    else if (Array.isArray(juegosData.juegos)) loaded = juegosData.juegos;
    else loaded = [];

    const canonical = loaded.map((g) => {
      if (typeof g === "string") return { grupo: g, items: [] };
      if (g.grupo && Array.isArray(g.items)) return g;
      if (g.nombre && Array.isArray(g.items))
        return { grupo: g.nombre, items: g.items };
      return { grupo: g.grupo || g.nombre || "Sin nombre", items: g.items || [] };
    });

    setGroups(canonical);
  }, []);

  /* ----------------- CRUD (memoria) ----------------- */
  const handleCreateGroup = () => {
    playClick();
    const nombre = prompt("Nombre del nuevo grupo:");
    if (!nombre) return;
    setGroups((prev) => [...prev, { grupo: nombre.trim(), items: [] }]);
    setExpandedGroup(nombre.trim());
  };

  const handleRenameGroup = (index) => {
    playClick();
    const current = groups[index].grupo;
    const nuevo = prompt("Nuevo nombre:", current);
    if (!nuevo) return;
    setGroups((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], grupo: nuevo.trim() };
      return copy;
    });
  };

  const handleDeleteGroup = (index) => {
    playClick();
    const ok = window.confirm(`Eliminar "${groups[index].grupo}"?`);
    if (!ok) return;
    setGroups((prev) => prev.filter((_, i) => i !== index));
    setExpandedGroup(null);
  };

  const handleAddItem = (index) => {
    playClick();
    const nombre = prompt(`Agregar elemento a ${groups[index].grupo}:`);
    if (!nombre) return;
    setGroups((prev) => {
      const copy = [...prev];
      copy[index] = {
        ...copy[index],
        items: [...(copy[index].items || []), nombre.trim()],
      };
      return copy;
    });
    setExpandedGroup(groups[index].grupo);
  };

  const handleDeleteItem = (gIdx, itemIdx) => {
    playClick();
    const ok = window.confirm("¿Eliminar este elemento?");
    if (!ok) return;
    setGroups((prev) => {
      const copy = [...prev];
      const items = [...copy[gIdx].items];
      items.splice(itemIdx, 1);
      copy[gIdx] = { ...copy[gIdx], items };
      return copy;
    });
  };

  const toggleExpand = (grupoName) => {
    playClick();
    setExpandedGroup((prev) => (prev === grupoName ? null : grupoName));
  };

  /* ----------------- RENDER ----------------- */
  return (
    <div className="gi-admin-page">
      <Sonidos />
      <div className="gi-admin-root">
        
        {/* ======= PESTAÑAS ======= */}
        <div className="gi-tabs">
          <div
            className={`gi-tab ${activeTab === "admin" ? "gi-tab--active" : ""}`}
            onMouseEnter={playHover}
            onClick={() => {
              playClick();
              setActiveTab("admin");
            }}
          >
            Admin
          </div>
           {/* ======= USER NO FUNCIONA, ACTUALIZAR AL CONECTAR EL BACK ======= */}
          <div
            className={`gi-tab ${activeTab === "user" ? "gi-tab--active" : ""}`}
            onMouseEnter={playHover}
            onClick={() => {
              playClick();
              setActiveTab("user");
            }}
          >
           
            User
          </div>
        </div>

        {/* ======= CONTENIDO ======= */}
        <div className="gi-tabcontent">
          {activeTab === "admin" ? (
            <section className="gi-panel-admin">
              <header className="gi-panel-header">
                <h1 className="gi-title">Panel de Administración</h1>
                <div className="gi-global-actions">
                  <button
                    className="gi-btn gi-btn--primary"
                    onMouseEnter={playHover}
                    onClick={handleCreateGroup}
                  >
                    ➕ Nuevo Grupo
                  </button>
                </div>
              </header>

              <div className="gi-groups-grid">
                {groups.length === 0 ? (
                  <div className="gi-empty">
                    No hay grupos. Crea uno con "Nuevo Grupo".
                  </div>
                ) : (
                  groups.map((g, gi) => (
                    <article
                      key={gi}
                      className={`gi-group ${
                        expandedGroup === g.grupo ? "gi-group--expanded" : ""
                      }`}
                    >
                      <div className="gi-group-head">
                        <div
                          className="gi-group-title"
                          onMouseEnter={playHover}
                          onClick={() => toggleExpand(g.grupo)}
                        >
                          <span className="gi-folder-emoji">📁</span>
                          <span>{g.grupo}</span>
                        </div>

                        <div className="gi-group-controls">
                          <button
                            className="gi-smallbtn"
                            title="Agregar item"
                            onMouseEnter={playHover}
                            onClick={() => handleAddItem(gi)}
                          >
                            ➕
                          </button>
                          <button
                            className="gi-smallbtn"
                            title="Renombrar grupo"
                            onMouseEnter={playHover}
                            onClick={() => handleRenameGroup(gi)}
                          >
                            ✏️
                          </button>
                          <button
                            className="gi-smallbtn gi-smallbtn--danger"
                            title="Eliminar grupo"
                            onMouseEnter={playHover}
                            onClick={() => handleDeleteGroup(gi)}
                          >
                            🗑️
                          </button>
                        </div>
                      </div>

                      {expandedGroup === g.grupo && (
                        <div className="gi-group-body">
                          {g.items && g.items.length > 0 ? (
                            <ul className="gi-item-list">
                              {g.items.map((it, ii) => (
                                <li key={ii} className="gi-item">
                                  <span>{it}</span>
                                  <div className="gi-item-controls">
                                    <button
                                      className="gi-smallbtn"
                                      title="Editar"
                                      onMouseEnter={playHover}
                                      onClick={playClick}
                                    >
                                      ✏️
                                    </button>
                                    <button
                                      className="gi-smallbtn gi-smallbtn--danger"
                                      onMouseEnter={playHover}
                                      onClick={() => handleDeleteItem(gi, ii)}
                                      title="Eliminar"
                                    >
                                      🗑️
                                    </button>
                                  </div>
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <div className="gi-empty">
                              No hay elementos en este grupo.
                            </div>
                          )}
                        </div>
                      )}
                    </article>
                  ))
                )}
              </div>
            </section>
          ) : (
            <section className="gi-panel-user">
              <Jugar />
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

export default Admin;
