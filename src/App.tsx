import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Simulator from './pages/Simulator';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/simulator" element={<Simulator />} />
      </Routes>
    </Router>
  );
}

export default App;
