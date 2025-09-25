import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './styles/styles.css';
import InicioPage from './Pages/InicioPage';
import Jugar from './Pages/Jugar';
import Login from './Pages/Login';
import SignUp from './Pages/SignUp';
import './styles/login.css';
import './styles/signup.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/InicioPage" element={<InicioPage />} />
        <Route path="/Jugar" element={<Jugar />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/SignUp" element={<SignUp />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
