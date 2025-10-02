import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import RegistrarObra from './components/RegistrarObra';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/registrar" element={<RegistrarObra />} />
      </Routes>
    </Router>
  );
}

export default App;
