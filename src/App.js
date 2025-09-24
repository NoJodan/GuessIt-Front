import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './styles/styles.css';
import InicioPage from './Pages/InicioPage';
import Jugar from './Pages/Jugar';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<InicioPage />} />
        <Route path="/Jugar" element={<Jugar />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
