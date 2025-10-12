import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/jugar.css";

function Theme() {
  const { id } = useParams();
  // Si la ruta no trae id válido, intentar recuperar el seleccionado guardado en localStorage
  const navigate = useNavigate();
  const parseId = (raw) => {
    if (!raw) return null;
    const n = Number(raw);
    return Number.isFinite(n) ? n : null;
  };
  const routeId = parseId(id);
  const fallbackId = (() => {
    try {
      const v = localStorage.getItem('selectedThemeId');
      return v ? parseId(v) : null;
    } catch (e) {
      return null;
    }
  })();
  const themeId = routeId !== null ? routeId : (fallbackId !== null ? fallbackId : null);

  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [inputUsuario, setInputUsuario] = useState("");
  const [sugerencias, setSugerencias] = useState([]);
  const [resultado, setResultado] = useState({});
  const [mensaje, setMensaje] = useState("");
  const [juegoTerminado, setJuegoTerminado] = useState(false);
  const [lastHints, setLastHints] = useState(null);
  const [loading, setLoading] = useState(true);

  const getItemsByTheme = async (themeId) => {  
    try {  
      const token = localStorage.getItem('token');  
      const response = await fetch(`http://localhost:8080/api/admin/game/themes/${themeId}/items`, {  
        method: 'GET',  
        headers: {  
          'Authorization': `Bearer ${token}`,  
          'Content-Type': 'application/json'  
        }  
      });  
        
      const data = await response.json();  
        
      if (response.ok) {  
        return { success: true, items: data.items };  
      } else {  
        return { success: false, error: data.error || data.message || JSON.stringify(data) };  
      }  
    } catch (error) {  
      return { success: false, error: 'Error de conexión' };  
    }  
  };

  const getCategoriesByTheme = async (themeId) => {  
    try {  
      const token = localStorage.getItem('token');  
      const response = await fetch(`http://localhost:8080/api/admin/game/themes/${themeId}/categories`, {  
        method: 'GET',  
        headers: {  
          'Authorization': `Bearer ${token}`,  
          'Content-Type': 'application/json'  
        }  
      });  
        
      const data = await response.json();  
        
      if (response.ok) {  
        return { success: true, categories: data.categories };  
      } else {  
        return { success: false, error: data.error || data.message || JSON.stringify(data) };  
      }  
    } catch (error) {  
      return { success: false, error: 'Error de conexión' };  
    }  
  };

  // La selección aleatoria ahora la hace el backend. El frontend solo envía guesses.
  const resetGame = () => {
    setResultado({});
    setMensaje("");
    setJuegoTerminado(false);
    setInputUsuario("");
    setSugerencias([]);
    setLastHints(null);
  };

  const makeGuess = async (themeId, itemName, jwtToken) => {
    const body = { themeId, itemName };

    const resp = await fetch('http://localhost:8080/api/game/guess', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(jwtToken ? { 'Authorization': `Bearer ${jwtToken}` } : {})
      },
      body: JSON.stringify(body),
      credentials: 'include'
    });

    const data = await resp.json();

    if (!resp.ok) {
      // lanzar para que el caller lo capture
      throw new Error(data?.error || 'Error en la petición');
    }

    return data.guessResult;
  };

  useEffect(() => {
    const load = async () => {
      if (themeId === null) {
        // no hay id válido: dejamos de cargar y evitamos llamadas con NaN
        setLoading(false);
        return;
      }
      setLoading(true);
      const resItems = await getItemsByTheme(themeId);
      const resCats = await getCategoriesByTheme(themeId);

      if (resItems.success) setItems(resItems.items || []);
      else alert(resItems.error || 'No se pudieron obtener items');

      if (resCats.success) setCategories(resCats.categories || []);
      else alert(resCats.error || 'No se pudieron obtener categorías');

      setLoading(false);
        // No seleccionamos item localmente; el backend elegirá el objetivo del juego.
    };

    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [themeId]);

  // Autocompletar basándonos en los nombres de items
  const handleInputChange = (e) => {
    const valor = e.target.value;
    setInputUsuario(valor);

    if (valor.length > 0) {
      const filtrados = items
        .map((i) => i.name)
        .filter((nombre) =>
          nombre.toLowerCase().includes(valor.toLowerCase())
        );
      setSugerencias(filtrados);
    } else {
      setSugerencias([]);
    }
  };

  const handleSugerenciaClick = (nombre) => {
    setInputUsuario(nombre);
    setSugerencias([]);
  };

  const handleIntento = async (e) => {
    e.preventDefault();
    if (juegoTerminado) return;

    const itemName = inputUsuario.trim();
    if (!itemName) return;

    try {
      const token = localStorage.getItem('token');
      const guessResult = await makeGuess(themeId, itemName, token);

      const hints = guessResult.attributeHints || [];
      setLastHints(hints);

      // Determinar si la adivinanza es correcta
      const correctFlag = guessResult.hasOwnProperty('correct') ? guessResult.correct : null;
      let isCorrect = false;
      if (typeof correctFlag === 'boolean') {
        isCorrect = correctFlag;
      } else if (typeof correctFlag === 'string') {
        isCorrect = correctFlag.toLowerCase() === 'true' || correctFlag.toLowerCase() === 'correcto';
      } else {
        if (hints.length > 0) {
          isCorrect = hints.every(h => String(h.hint).toLowerCase() === 'correcto');
        }
      }

      if (isCorrect) {
        setMensaje(`🎉 ¡Correcto! Era ${itemName}`);
        setJuegoTerminado(true);
      } else {
        setMensaje('Sigue intentando...');
      }

    } catch (err) {
      // Puede venir { error: 'Item no encontrado' }
      alert(err.message || 'Error en la petición');
    }

    setInputUsuario("");
    setSugerencias([]);
  };

  if (loading) return <div style={{textAlign:'center', marginTop:40}}>Cargando...</div>;

  return (
    <div className="theme-page">
      <div style={{ textAlign: "center", marginTop: "40px" }}>
        <h1>{categories.length > 0 ? categories[0].theme?.name || 'Tema' : 'Tema'}</h1>
        {!juegoTerminado && <p>Escribe cualquier nombre para iniciar</p>}

        <form onSubmit={handleIntento} style={{ position: "relative" }}>
          <input
            type="text"
            value={inputUsuario}
            onChange={handleInputChange}
            placeholder={`Escribe un ${categories.length>0?categories[0].theme?.name?.slice(0,-1).toLowerCase():'item'}`}
            disabled={juegoTerminado}
          />
          <button type="submit" disabled={juegoTerminado}>
            Verificar
          </button>

          {/* Autocompletar */}
          {sugerencias.length > 0 && !juegoTerminado && (
            <ul
              style={{
                position: "absolute",
                background: "white",
                border: "1px solid #ccc",
                listStyle: "none",
                padding: 0,
                margin: 0,
                width: "200px",
                maxHeight: "150px",
                overflowY: "auto",
                zIndex: 10,
              }}
            >
              {sugerencias.map((nombre, i) => (
                <li
                  key={i}
                  onClick={() => handleSugerenciaClick(nombre)}
                  style={{
                    padding: "5px",
                    cursor: "pointer",
                    borderBottom: "1px solid #eee",
                  }}
                >
                  {nombre}
                </li>
              ))}
            </ul>
          )}
        </form>

        {mensaje && <p>{mensaje}</p>}

        {/* Mostrar todas las categorías del tema; si el backend devolvió hints, mostrarlos junto a cada categoría */}
        {categories && categories.length > 0 ? (
          <div style={{ marginTop: "20px" }}>
            <h3>Categorías:</h3>
            <ul style={{ listStyle: "none", padding: 0 }}>
              {categories.map((cat) => {
                const key = String(cat.name).toLowerCase();
                const hintObj = (lastHints || []).find(h => String(h.attributeName).toLowerCase() === key);
                const displayValue = hintObj ? hintObj.value : '—';
                const displayHint = hintObj ? hintObj.hint : '';
                const color = displayHint && String(displayHint).toLowerCase() === 'correcto' ? 'green' : (displayHint ? 'red' : 'black');
                return (
                  <li key={cat.id} style={{ color }}>
                    {cat.name}: {displayValue} {displayHint ? `— ${displayHint}` : ''}
                  </li>
                );
              })}
            </ul>
          </div>
        ) : (
          <div style={{ marginTop: "20px" }}>
            <p>No hay categorías para este tema.</p>
          </div>
        )}

        

        {juegoTerminado && (
          <button
            onClick={resetGame}
            style={{
              marginTop: "20px",
              padding: "10px 20px",
              cursor: "pointer",
              background: "#007bff",
              color: "white",
              border: "none",
              borderRadius: "5px",
            }}
          >
            Volver a intentar
          </button>
        )}
      </div>
    </div>
  );
}

export default Theme;
