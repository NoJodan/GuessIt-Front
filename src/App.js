import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./styles/styles.css";
import InicioPage from "./Pages/InicioPage";
import Jugar from "./Pages/Jugar";
import Login from "./Pages/Login";
import SignUp from "./Pages/SignUp";
import AdminPanel from "./Pages/AdminPanel";
import Admin from "./Pages/Admin";
import Editor from "./Pages/Editor";
import "./styles/login.css";
import "./styles/signup.css";

import Futbolistas from "./Pages/Categorias/Futbolistas";
import Empresas from "./Pages/Categorias/Empresas";
import Theme from "./Pages/Theme";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/InicioPage" replace />} />{" "}
        /*esto es para al iniciar con npm start, nos lleve directamente a
        /InicioPage */
        <Route path="/Editor/:modoId" element={<Editor />} />
        <Route path="/AdminPanel" element={<AdminPanel />} />
        <Route path="/Admin" element={<Admin />} />
        <Route path="/InicioPage" element={<InicioPage />} />
        <Route path="/Jugar" element={<Jugar />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/SignUp" element={<SignUp />} />
        <Route path="/jugar/futbolistas" element={<Futbolistas />} />
        <Route path="/jugar/empresa" element={<Empresas />} />
        <Route path="/tema/:id" element={<Theme />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
