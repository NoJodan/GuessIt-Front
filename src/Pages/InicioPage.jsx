import { Link } from "react-router-dom";

function InicioPage() {
  return (
    <div className="ContainerInicio">
      <header className="panel">
        <Link to="/Login">
        <h2 id="ingresar">Ingresar</h2>
        </Link>
        <Link to="/SignUp">
        <h2 id="registrarse">Registrarse</h2>
        </Link>
      </header>
      
      <header className="logo">
        <img id="LogoPagina" src="/images/LogoPaginaBlanco.png" alt="Logo de la pagina web" width="500px" height="auto"/>
      </header>

      <section>
        <div className="menu">
          <Link to="/Jugar">
            <h2 id="btn-jugar">Jugar</h2>
          </Link>
        </div>
      </section>

      <footer>
        
      </footer>
    </div>
  );
}

export default InicioPage;
