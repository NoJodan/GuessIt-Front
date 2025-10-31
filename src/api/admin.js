const BASE_URL = "https://zooming-integrity-production-6c7d.up.railway.app";

function getAuthHeaders() {
	const token = localStorage.getItem("token");
	return {
		Authorization: `Bearer ${token}`,
		"Content-Type": "application/json",
		Accept: "application/json",
	};
}

async function handleResponse(response) {
	const data = await response.json().catch(() => ({}));
	if (!response.ok) {
		throw new Error(data.message || "Error en la solicitud");
	}
	return data;
}

// Themes
export async function listThemes() {
	const res = await fetch(`${BASE_URL}/api/admin/game/themes`, {
		headers: getAuthHeaders(),
	});
	return handleResponse(res);
}

export async function createTheme(name) {
	const res = await fetch(`${BASE_URL}/api/admin/game/themes`, {
		method: "POST",
		headers: getAuthHeaders(),
		body: JSON.stringify({ name }),
	});
	return handleResponse(res);
}

export async function updateTheme(themeId, name) {
	const res = await fetch(`${BASE_URL}/api/admin/game/themes/${themeId}`, {
		method: "PUT",
		headers: getAuthHeaders(),
		body: JSON.stringify({ name }),
	});
	return handleResponse(res);
}

export async function deleteTheme(themeId) {
	const res = await fetch(`${BASE_URL}/api/admin/game/themes/${themeId}`, {
		method: "DELETE",
		headers: getAuthHeaders(),
	});
	return handleResponse(res);
}

// Categories
export async function listCategories(themeId) {
	const res = await fetch(`${BASE_URL}/api/admin/game/themes/${themeId}/categories`, {
		headers: getAuthHeaders(),
	});
	return handleResponse(res);
}

export async function createCategory(themeId, name) {
	const res = await fetch(`${BASE_URL}/api/admin/game/themes/categories`, {
		method: "POST",
		headers: getAuthHeaders(),
		body: JSON.stringify({ themeId, name }),
	});
	return handleResponse(res);
}

export async function updateCategory(categoryId, name) {
	const res = await fetch(`${BASE_URL}/api/admin/game/categories/${categoryId}`, {
		method: "PUT",
		headers: getAuthHeaders(),
		body: JSON.stringify({ name }),
	});
	return handleResponse(res);
}

export async function deleteCategory(categoryId) {
	const res = await fetch(`${BASE_URL}/api/admin/game/categories/${categoryId}`, {
		method: "DELETE",
		headers: getAuthHeaders(),
	});
	return handleResponse(res);
}

// Items
export async function listItems(themeId) {
	const res = await fetch(`${BASE_URL}/api/admin/game/themes/${themeId}/items`, {
		headers: getAuthHeaders(),
	});
	return handleResponse(res);
}

export async function createItem(themeId, name) {
	const res = await fetch(`${BASE_URL}/api/admin/game/themes/items`, {
		method: "POST",
		headers: getAuthHeaders(),
		body: JSON.stringify({ themeId, name }),
	});
	return handleResponse(res);
}

export async function updateItem(itemId, name) {
	const res = await fetch(`${BASE_URL}/api/admin/game/items/${itemId}` , {
		method: "PUT",
		headers: getAuthHeaders(),
		body: JSON.stringify({ name }),
	});
	return handleResponse(res);
}

export async function deleteItem(itemId) {
	const res = await fetch(`${BASE_URL}/api/admin/game/items/${itemId}`, {
		method: "DELETE",
		headers: getAuthHeaders(),
	});
	return handleResponse(res);
}

// Attributes
export async function listAttributes(themeId, categoryId, itemId) {
	const res = await fetch(
		`${BASE_URL}/api/admin/game/themes/${themeId}/categories/${categoryId}/items/${itemId}/attributes`,
		{ headers: getAuthHeaders() },
	);
	return handleResponse(res);
}

export async function createAttribute(themeId, categoryId, itemId, value) {
	const res = await fetch(`${BASE_URL}/api/admin/game/themes/categories/items/attributes`, {
		method: "POST",
		headers: getAuthHeaders(),
		body: JSON.stringify({ themeId, categoryId, itemId, value }),
	});
	return handleResponse(res);
}

export async function updateAttribute(attributeId, value) {
	const res = await fetch(`${BASE_URL}/api/admin/game/attributes/${attributeId}`, {
		method: "PUT",
		headers: getAuthHeaders(),
		body: JSON.stringify({ value }),
	});
	return handleResponse(res);
}

export async function deleteAttribute(attributeId) {
	const res = await fetch(`${BASE_URL}/api/admin/game/attributes/${attributeId}`, {
		method: "DELETE",
		headers: getAuthHeaders(),
	});
	return handleResponse(res);
}

// Optional: daily
export async function getDaily(themeId) {
	const res = await fetch(`${BASE_URL}/api/admin/game/${themeId}/daily`, {
		headers: getAuthHeaders(),
	});
	return handleResponse(res);
}


