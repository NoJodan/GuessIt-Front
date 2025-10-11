import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './styles/styles.css';
import InicioPage from './Pages/InicioPage';
import Jugar from './Pages/Jugar';
import Login from './Pages/Login';
import SignUp from './Pages/SignUp';
import AdminPanel from './Pages/AdminPanel';
import Instrucciones from './Pages/Instrucciones';
import Editor from './Pages/Editor';
import Tablero1 from './Pages/modosJuego/Tablero1';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/InicioPage" replace />} /> {/*esto es para al iniciar con npm start, nos lleve directamente a /InicioPage */}

        <Route path="/Editor/:modoId" element={<Editor />} />    
        <Route path="/jugar/:id" element={<Tablero1 />} />  
        <Route path="/AdminPanel" element={<AdminPanel />} />
        <Route path="/InicioPage" element={<InicioPage />} />
        <Route path="/Instrucciones" element={<Instrucciones />} />

        <Route path="/Jugar" element={<Jugar />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/SignUp" element={<SignUp />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
