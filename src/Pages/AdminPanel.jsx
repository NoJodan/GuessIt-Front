import React, { useState } from "react";
import "../styles/admin.css";

// Datos simulados (ejemplo)
const modos = [
  { id: "empresas", nombre: "Empresas" },
  { id: "futbolistas", nombre: "Futbolistas" },
  { id: "ciudades", nombre: "Ciudades" }
];

function AdminPanel() {
  const [modoSeleccionado, setModoSeleccionado] = useState(null);

  return (
    <div className="admin-page">
      {/* HEADER */}
      <header className="admin-header">
        <h1>Panel Administrativo</h1>
      </header>

      {/* BOTONES CRUD */}
      <div className="admin-actions">
        <button className="btn-create">➕ Crear Modo</button>
        <button className="btn-update">✏️ Editar Modo</button>
        <button className="btn-delete">🗑️ Eliminar Modo</button>
      </div>

      {/* LISTADO DE MODOS */}
      <div className="modos-lista">
        {modos.map((modo) => (
          <div
            key={modo.id}
            className={`modo-card ${modoSeleccionado === modo.id ? "activo" : ""}`}
            onClick={() => setModoSeleccionado(modo.id)}
          >
            <span>{modo.nombre}</span>
          </div>
        ))}
      </div>

      {/* EDITOR DEL MODO SELECCIONADO */}
      <div className="modo-editor">
        {modoSeleccionado ? (
          <div className="editor-card">
            <h2>Editor de {modos.find((m) => m.id === modoSeleccionado).nombre}</h2>
            {/* Aquí irá la tabla o inputs según el modo */}
            <p>📋 Aquí puedes gestionar los datos de este modo</p>
            <button className="btn-add">Agregar Item</button>
          </div>
        ) : (
          <p className="seleccion-placeholder">Selecciona un modo para editarlo</p>
        )}
      </div>
    </div>
  );
}

export default AdminPanel;
