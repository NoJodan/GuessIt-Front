import React, { useEffect, useState } from "react";
import juegosData from "../modulo json/juegos.json"; // ajusta la ruta si es necesario
import "../styles/admin.css";
import Jugar from "../Pages/Jugar";

const Admin = () => {
  const [activeTab, setActiveTab] = useState("admin"); // 'admin' | 'user'
  const [groups, setGroups] = useState([]);
  const [expandedGroup, setExpandedGroup] = useState(null);
  const [editingGroupIndex, setEditingGroupIndex] = useState(null);

  useEffect(() => {
    // === SONIDO DE FONDO EN ADMIN ===
    const bgMusic = new Audio("/sounds/fondo_menu.mp3"); 
    bgMusic.loop = true;
    bgMusic.volume = 0;

    // Fade-in suave
    const fadeIn = setInterval(() => {
      if (bgMusic.volume < 0.3) {
        bgMusic.volume += 0.02;
      } else {
        clearInterval(fadeIn);
      }
    }, 200);

    // Intentar reproducir tras interacción del usuario
    const playMusic = () => {
      bgMusic.play().catch(err => console.warn("Autoplay bloqueado:", err));
    };
    document.addEventListener("click", playMusic, { once: true });

    // Limpieza al desmontar
    return () => {
      clearInterval(fadeIn);
      bgMusic.pause();
      bgMusic.currentTime = 0;
    };
  }, []);

  useEffect(() => {
    // Carga del JSON (diferentes estructuras posibles)
    let loaded = [];
    if (Array.isArray(juegosData)) loaded = juegosData;
    else if (Array.isArray(juegosData.modos)) loaded = juegosData.modos;
    else if (Array.isArray(juegosData.modulos)) loaded = juegosData.modulos;
    else if (Array.isArray(juegosData.juegos)) loaded = juegosData.juegos;

    // Canonicalización de estructura
    const canonical = loaded.map((g) => {
      if (typeof g === "string") return { grupo: g, items: [] };
      if (g.grupo && Array.isArray(g.items)) return g;
      if (g.nombre && Array.isArray(g.items))
        return { grupo: g.nombre, items: g.items };
      return {
        grupo: g.grupo || g.nombre || "Sin nombre",
        items: g.items || [],
      };
    });

    setGroups(canonical);
  }, []);

  /* ---------- CRUD (en memoria) ---------- */
  const handleCreateGroup = () => {
    const nombre = prompt("Nombre del nuevo grupo (modo):");
    if (!nombre) return;
    setGroups((prev) => [...prev, { grupo: nombre.trim(), items: [] }]);
    setExpandedGroup(nombre.trim());
  };

  const handleRenameGroup = (index) => {
    const current = groups[index].grupo;
    const nuevo = prompt("Nuevo nombre del grupo:", current);
    if (!nuevo) return;
    setGroups((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], grupo: nuevo.trim() };
      return copy;
    });
  };

  const handleDeleteGroup = (index) => {
    const ok = window.confirm(
      `Eliminar el grupo "${groups[index].grupo}"? Esta acción no es reversible.`,
    );
    if (!ok) return;
    setGroups((prev) => prev.filter((_, i) => i !== index));
    setExpandedGroup(null);
  };

  const handleAddItem = (index) => {
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
    const ok = window.confirm("Eliminar este elemento?");
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
    setExpandedGroup((prev) => (prev === grupoName ? null : grupoName));
  };

  return (
    <div className="gi-admin-page">
      <div className="gi-admin-root">
        {/* PESTAÑAS TIPO CARPETA */}
        <div className="gi-tabs">
          <div
            className={`gi-tab ${activeTab === "admin" ? "gi-tab--active" : ""}`}
            onClick={() => setActiveTab("admin")}
          >
            Admin
          </div>
          <div
            className={`gi-tab ${activeTab === "user" ? "gi-tab--active" : ""}`}
            onClick={() => setActiveTab("user")}
          >
            User
          </div>
        </div>

        {/* CONTENIDO */}
        <div className="gi-tabcontent">
          {activeTab === "admin" ? (
            <section className="gi-panel-admin">
              <header className="gi-panel-header">
                <h1 className="gi-title">Panel de Administración</h1>
                <div className="gi-global-actions">
                  <button
                    className="gi-btn gi-btn--primary"
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
                      className={`gi-group ${expandedGroup === g.grupo ? "gi-group--expanded" : ""}`}
                    >
                      <div className="gi-group-head">
                        <div
                          className="gi-group-title"
                          onClick={() => toggleExpand(g.grupo)}
                        >
                          <span className="gi-folder-emoji">📁</span>
                          <span>{g.grupo}</span>
                        </div>

                        <div className="gi-group-controls">
                          <button
                            className="gi-smallbtn"
                            title="Agregar item"
                            onClick={() => handleAddItem(gi)}
                          >
                            ➕
                          </button>
                          <button
                            className="gi-smallbtn"
                            title="Renombrar grupo"
                            onClick={() => handleRenameGroup(gi)}
                          >
                            ✏️
                          </button>
                          <button
                            className="gi-smallbtn gi-smallbtn--danger"
                            title="Eliminar grupo"
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
                                      title="Editar (no implementado)"
                                    >
                                      ✏️
                                    </button>
                                    <button
                                      className="gi-smallbtn gi-smallbtn--danger"
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
