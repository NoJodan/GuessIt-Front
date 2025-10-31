import React, { useEffect, useMemo, useRef, useState } from "react";
import {
	listThemes,
	createTheme,
	updateTheme,
	deleteTheme,
	listCategories,
	createCategory,
	updateCategory,
	deleteCategory,
	listItems,
	createItem,
	updateItem,
	deleteItem,
	listAttributes,
	createAttribute,
	updateAttribute,
	deleteAttribute,
} from "../api/admin";
import "../styles/admin.css";

function Admin() {
	const [themes, setThemes] = useState([]);
	const [selectedThemeId, setSelectedThemeId] = useState(null);
	const [showAdvanced, setShowAdvanced] = useState(false);

	const [categories, setCategories] = useState([]);
	const [items, setItems] = useState([]);
	const [selectedCategoryId, setSelectedCategoryId] = useState(null);
	const [selectedItemId, setSelectedItemId] = useState(null);
	const [attributesByCategory, setAttributesByCategory] = useState({});
	const [attributesLoading, setAttributesLoading] = useState(false);
	const loadKeyRef = useRef(0);
const attributesCacheRef = useRef(new Map()); // itemId -> { [categoryId]: attribute|null }

	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");

	const selectedTheme = useMemo(
		() => themes.find((t) => t.id === selectedThemeId) || null,
		[themes, selectedThemeId],
	);

	async function refreshThemes() {
		setLoading(true);
		setError("");
		try {
			const data = await listThemes();
			const list = data?.data || data?.themes || [];
			setThemes(list);
			if (list.length > 0 && !selectedThemeId) setSelectedThemeId(list[0].id);
		} catch (e) {
			setError(e.message);
		} finally {
			setLoading(false);
		}
	}

	async function refreshCategories(themeId) {
		if (!themeId) return;
		setError("");
		try {
			const data = await listCategories(themeId);
			const list = data?.data || data?.categories || [];
			setCategories(list);
			if (list.length > 0 && !selectedCategoryId) setSelectedCategoryId(list[0].id);
		} catch (e) {
			setError(e.message);
		}
	}

	async function refreshItems(themeId) {
		if (!themeId) return;
		setError("");
		try {
			const data = await listItems(themeId);
			const list = data?.data || data?.items || [];
			setItems(list);
			if (list.length > 0 && !selectedItemId) setSelectedItemId(list[0].id);
		} catch (e) {
			setError(e.message);
		}
	}

async function loadAttributesForItem(themeId, itemId) {
		if (!themeId || !itemId || categories.length === 0) return;
		setError("");
		const myKey = ++loadKeyRef.current;
		setAttributesLoading(true);
		try {
			const pairs = await Promise.all(
				categories.map(async (c) => {
					const data = await listAttributes(themeId, c.id, itemId);
					const list = data?.data || data?.attributes || [];
					return [c.id, Array.isArray(list) && list.length > 0 ? list[0] : null];
				}),
			);
			if (loadKeyRef.current !== myKey) return;
			const result = Object.fromEntries(pairs);
			setAttributesByCategory(result);
			attributesCacheRef.current.set(itemId, result);
		} catch (e) {
			if (loadKeyRef.current === myKey) setError(e.message);
		} finally {
			if (loadKeyRef.current === myKey) setAttributesLoading(false);
		}
	}

	useEffect(() => {
		refreshThemes();
	}, []);

	useEffect(() => {
		// Al cambiar de temática, limpiar selección de item y atributos
		setSelectedItemId(null);
		setAttributesByCategory({});
		if (selectedThemeId) {
			// Cargar categorías SIEMPRE (aunque gestión avanzada esté oculta)
			refreshCategories(selectedThemeId);
			// Cargar items solo si gestión avanzada está visible
			if (showAdvanced) {
				refreshItems(selectedThemeId);
			}
		}
	}, [selectedThemeId, showAdvanced]);

// No hay efecto que recargue atributos automáticamente para evitar parpadeo; se carga al seleccionar item

	async function onAddTheme() {
		const name = prompt("Nombre de la temática:");
		if (!name) return;
		await createTheme(name.trim());
		await refreshThemes();
	}

	async function onEditTheme(theme) {
		const name = prompt("Nuevo nombre de la temática:", theme.name);
		if (!name) return;
		await updateTheme(theme.id, name.trim());
		await refreshThemes();
	}

	async function onDeleteTheme(theme) {
		const ok = window.confirm(`¿Eliminar temática "${theme.name}"?`);
		if (!ok) return;
		await deleteTheme(theme.id);
		if (selectedThemeId === theme.id) setSelectedThemeId(null);
		await refreshThemes();
	}

	async function onAddCategory() {
		const name = prompt("Nombre de la categoría:");
		if (!name || !selectedThemeId) return;
		await createCategory(selectedThemeId, name.trim());
		await refreshCategories(selectedThemeId);
	}

	async function onEditCategory(cat) {
		const name = prompt("Nuevo nombre de la categoría:", cat.name);
		if (!name) return;
		await updateCategory(cat.id, name.trim());
		await refreshCategories(selectedThemeId);
	}

	async function onDeleteCategory(cat) {
		const ok = window.confirm(`¿Eliminar categoría "${cat.name}"?`);
		if (!ok) return;
		await deleteCategory(cat.id);
		if (selectedCategoryId === cat.id) setSelectedCategoryId(null);
		await refreshCategories(selectedThemeId);
	}

	async function onAddItem() {
		const name = prompt("Nombre del item:");
		if (!name || !selectedThemeId) return;
		await createItem(selectedThemeId, name.trim());
		await refreshItems(selectedThemeId);
	}

	async function onEditItem(it) {
		const name = prompt("Nuevo nombre del item:", it.name);
		if (!name) return;
		await updateItem(it.id, name.trim());
		await refreshItems(selectedThemeId);
	}

	async function onDeleteItem(it) {
		const ok = window.confirm(`¿Eliminar item "${it.name}"?`);
		if (!ok) return;
		await deleteItem(it.id);
		if (selectedItemId === it.id) setSelectedItemId(null);
		await refreshItems(selectedThemeId);
	}

	function onSelectItem(itemId) {
		// Autoseleccionar primera categoría si no hay una seleccionada
		if (!selectedCategoryId && categories.length > 0) {
			setSelectedCategoryId(categories[0].id);
		}
		setSelectedItemId(itemId);
		const cached = attributesCacheRef.current.get(itemId);
		if (cached) {
			setAttributesByCategory(cached);
			setAttributesLoading(false);
		} else {
			setAttributesByCategory({});
			setAttributesLoading(true);
			loadAttributesForItem(selectedThemeId, itemId);
		}
	}

	function onSelectCategory(categoryId) {
		setSelectedCategoryId(categoryId);
	}

	async function onEditAttribute(attr) {
		const value = prompt("Nuevo valor del atributo:", attr.value);
		if (value == null) return;
		await updateAttribute(attr.id, String(value));
		attributesCacheRef.current.delete(selectedItemId);
		await loadAttributesForItem(selectedThemeId, selectedItemId);
	}

	async function onDeleteAttribute(attr) {
		const ok = window.confirm("¿Eliminar atributo?");
		if (!ok) return;
		await deleteAttribute(attr.id);
		attributesCacheRef.current.delete(selectedItemId);
		await loadAttributesForItem(selectedThemeId, selectedItemId);
	}

	return (
		<div className="gi-admin-page">
			<div className="gi-admin-root">
				<header className="gi-panel-header" style={{ justifyContent: "center" }}>
					<h1 className="gi-title">Panel de Administración</h1>
				</header>

				{error && (
					<div className="gi-empty" style={{ color: "#ffb3b3" }}>{error}</div>
				)}

				<section style={{ textAlign: "center" }}>
					<h2 style={{ marginTop: 0 }}>Temáticas</h2>
					<div style={{ marginBottom: "1rem" }}>
						<button className="gi-btn" onClick={onAddTheme}>➕ Crear temática</button>
					</div>
					<div className="gi-groups-grid" style={{ alignItems: "center" }}>
						{loading && <div className="gi-empty">Cargando...</div>}
						{!loading && themes.length === 0 && (
							<div className="gi-empty">Sin temáticas</div>
						)}
						{themes.map((t) => (
							<article key={t.id} className={`gi-group ${selectedThemeId === t.id ? "gi-group--expanded" : ""}`} style={{ maxWidth: 640 }}>
								<div className="gi-group-head">
									<div className="gi-group-title" onClick={() => setSelectedThemeId(t.id)}>
										<span className="gi-folder-emoji">📁</span>
										<span>{t.name}</span>
									</div>
									<div className="gi-group-controls">
										<button className="gi-smallbtn" title="Editar" onClick={() => onEditTheme(t)}>✏️</button>
										<button className="gi-smallbtn gi-smallbtn--danger" title="Eliminar" onClick={() => onDeleteTheme(t)}>🗑️</button>
									</div>
								</div>
							</article>
						))}
					</div>
					<div style={{ marginTop: "1.5rem" }}>
						<button className="gi-btn" onClick={() => setShowAdvanced((v) => !v)}>
							{showAdvanced ? "Ocultar gestión avanzada" : "Mostrar gestión avanzada"}
						</button>
					</div>
				</section>

				{showAdvanced && selectedTheme && (
					<section style={{ marginTop: "2rem", textAlign: "center" }}>
						<h2>Gestión avanzada de "{selectedTheme.name}"</h2>
						<div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 16, maxWidth: 980, margin: "0 auto" }}>
							{/* Categorías */}
							<article className="gi-group">
								<div className="gi-group-head" style={{ cursor: "default" }}>
									<div className="gi-group-title"><span>🗂️</span><span>Categorías</span></div>
									<div>
										<button className="gi-smallbtn" title="Agregar" onClick={onAddCategory}>➕</button>
									</div>
								</div>
								<div className="gi-group-body">
									{categories.length === 0 && <div className="gi-empty">Sin categorías</div>}
									<ul className="gi-item-list">
										{categories.map((c) => (
											<li key={c.id} className="gi-item">
											<span style={{ cursor: "pointer" }} onClick={() => onSelectCategory(c.id)}>
													{c.name}
												</span>
												<div className="gi-item-controls">
													<button className="gi-smallbtn" onClick={() => onEditCategory(c)}>✏️</button>
													<button className="gi-smallbtn gi-smallbtn--danger" onClick={() => onDeleteCategory(c)}>🗑️</button>
												</div>
											</li>
										))}
									</ul>
								</div>
							</article>

						{/* Items con atributos embebidos */}
							<article className="gi-group">
								<div className="gi-group-head" style={{ cursor: "default" }}>
									<div className="gi-group-title"><span>📦</span><span>Items</span></div>
									<div>
										<button className="gi-smallbtn" title="Agregar" onClick={onAddItem}>➕</button>
									</div>
								</div>
								<div className="gi-group-body">
									{items.length === 0 && <div className="gi-empty">Sin items</div>}
									<ul className="gi-item-list">
									{items.map((it) => (
										<li
											key={it.id}
											className="gi-item"
											style={selectedItemId === it.id ? { display: "flex", flexDirection: "column", alignItems: "stretch", gap: 8 } : undefined}
										>
											<div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
												<span style={{ cursor: "pointer" }} onClick={() => onSelectItem(it.id)}>
													{it.name}
												</span>
												<div className="gi-item-controls">
													<button className="gi-smallbtn" onClick={() => onEditItem(it)}>✏️</button>
													<button className="gi-smallbtn gi-smallbtn--danger" onClick={() => onDeleteItem(it)}>🗑️</button>
												</div>
											</div>

											{selectedItemId === it.id && (
												<div style={{ marginTop: 8, background: "rgba(255,255,255,0.08)", borderRadius: 8, padding: "8px 10px" }}>
													<div className="gi-empty" style={{ padding: 0, textAlign: "left" }}>Atributos por categoría</div>
												{attributesLoading && (
													<div className="gi-empty">Cargando atributos...</div>
												)}
												{!attributesLoading && (
													<ul className="gi-item-list">
														{categories.map((c) => {
															const attr = attributesByCategory[c.id] || null;
															return (
																<li key={c.id} className="gi-item">
																	<span>{c.name}: {attr ? attr.value : "-"}</span>
																	<div className="gi-item-controls">
																		{attr ? (
																			<>
																				<button className="gi-smallbtn" onClick={() => onEditAttribute(attr)}>✏️</button>
																				<button className="gi-smallbtn gi-smallbtn--danger" onClick={() => onDeleteAttribute(attr)}>🗑️</button>
																			</>
																		) : (
																			<button className="gi-smallbtn" onClick={async () => {
																				const value = prompt(`Valor para \"${c.name}\"`);
																				if (value == null) return;
																				await createAttribute(selectedThemeId, c.id, it.id, String(value));
																				await loadAttributesForItem(selectedThemeId, it.id);
																			}}>➕</button>
																		)}
																	</div>
																</li>
															);
														})}
													</ul>
												)}
												</div>
											)}
										</li>
									))}
									</ul>
								</div>
							</article>
						</div>
					</section>
				)}
			</div>
		</div>
	);
}

export default Admin;


