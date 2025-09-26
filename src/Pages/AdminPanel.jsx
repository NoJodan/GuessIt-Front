import React, { useEffect, useState } from "react";
import juegosData from "../modulo json/juegos.json"; // ajusta la ruta si es necesario
import "../styles/admin.css"; // ajusta la ruta si guardas el CSS en otro lugar
import Jugar from "../Pages/Jugar"; // ajusta la ruta según tu proyecto

/**
 * Admin.jsx
 * - Panel con pestañas tipo "carpeta" (Admin / User)
 * - Carga modos/grupos desde JSON (juegosData) y los muestra como carpetas
 * - Botones CRUD por grupo: Add item, Rename group, Delete group
 * - Las operaciones son en memoria (para persistir necesitarás backend)
 *
 * NOTE: CSS usa prefijo `gi-` para evitar colisiones con otros estilos.
 */
const Admin = () => {
  const [activeTab, setActiveTab] = useState("admin"); // 'admin' | 'user'
  const [groups, setGroups] = useState([]);
  const [expandedGroup, setExpandedGroup] = useState(null); // nombre del grupo desplegado
  const [editingGroupIndex, setEditingGroupIndex] = useState(null);

  useEffect(() => {
    // soporta varias formas de estructura del JSON:
    // - un array directo: [ { grupo: "...", items: [...] }, ... ]
    // - o un objeto con propiedad 'modos' o 'modulos' o 'juegos'
    let loaded = [];
    if (Array.isArray(juegosData)) loaded = juegosData;
    else if (Array.isArray(juegosData.modos)) loaded = juegosData.modos;
    else if (Array.isArray(juegosData.modulos)) loaded = juegosData.modulos;
    else if (Array.isArray(juegosData.juegos)) loaded = juegosData.juegos;
    else loaded = []; // fallback

    // canonicaliza cada entrada a { grupo: string, items: string[] }
    const canonical = loaded.map((g) => {
      if (typeof g === "string") return { grupo: g, items: [] };
      if (g.grupo && Array.isArray(g.items)) return g;
      if (g.nombre && Array.isArray(g.items)) return { grupo: g.nombre, items: g.items };
      // otros formatos: convertir keys arbitrarias
      return { grupo: g.grupo || g.nombre || "Sin nombre", items: g.items || [] };
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
    const ok = window.confirm(`Eliminar el grupo "${groups[index].grupo}"? Esta acción no es reversible.`);
    if (!ok) return;
    setGroups((prev) => prev.filter((_, i) => i !== index));
    setExpandedGroup(null);
  };

  const handleAddItem = (index) => {
    const nombre = prompt(`Agregar elemento a ${groups[index].grupo}:`);
    if (!nombre) return;
    setGroups((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], items: [...(copy[index].items || []), nombre.trim()] };
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
                  <button className="gi-btn gi-btn--primary" onClick={handleCreateGroup}>
                    ➕ Nuevo Grupo
                  </button>
                </div>
              </header>

              <div className="gi-groups-grid">
                {groups.length === 0 ? (
                  <div className="gi-empty">No hay grupos. Crea uno con "Nuevo Grupo".</div>
                ) : (
                  groups.map((g, gi) => (
                    <article key={gi} className={`gi-group ${expandedGroup === g.grupo ? "gi-group--expanded" : ""}`}>
                      <div className="gi-group-head">
                        <div className="gi-group-title" onClick={() => toggleExpand(g.grupo)}>
                          <span className="gi-folder-emoji">📁</span>
                          <span>{g.grupo}</span>
                        </div>

                        <div className="gi-group-controls">
                          <button className="gi-smallbtn" title="Agregar item" onClick={() => handleAddItem(gi)}>
                            ➕
                          </button>
                          <button className="gi-smallbtn" title="Renombrar grupo" onClick={() => handleRenameGroup(gi)}>
                            ✏️
                          </button>
                          <button className="gi-smallbtn gi-smallbtn--danger" title="Eliminar grupo" onClick={() => handleDeleteGroup(gi)}>
                            🗑️
                          </button>
                        </div>
                      </div>

                      {/* items */}
                      {expandedGroup === g.grupo && (
                        <div className="gi-group-body">
                          {g.items && g.items.length > 0 ? (
                            <ul className="gi-item-list">
                              {g.items.map((it, ii) => (
                                <li key={ii} className="gi-item">
                                  <span>{it}</span>
                                  <div className="gi-item-controls">
                                    <button className="gi-smallbtn" title="Editar (no implementado)">✏️</button>
                                    <button className="gi-smallbtn gi-smallbtn--danger" onClick={() => handleDeleteItem(gi, ii)} title="Eliminar">
                                      🗑️
                                    </button>
                                  </div>
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <div className="gi-empty">No hay elementos en este grupo.</div>
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
              {/* Aquí cargamos la vista de usuario real */}
              <Jugar />
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

export default Admin;
