import './styles/styles.css';

function App() {
  return (
    <div className="App">

      <header className="panel">
        <h2 id="ingresar">Ingresar</h2>
        <h2 id="registrarse">Registrarse</h2>
      </header>
      
      
      <header className="logo">
          <img id="LogoPagina" src="/LogoPagina.png" alt="Logo de la pagina web" width="500px" height="auto"/>
      </header>

      <section>
          
          <div className="menu">
            <h2 id="btn-categoria">Seleccionar Categoria</h2>
            <br/> 
            <a href="jugar.html">
              <h2 id="btn-jugar">Jugar</h2>
            </a>
          </div>
      </section>

      <footer>

      </footer>
      
    </div>
  );
}

export default App;