import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { MainPage } from './pages/MainPage';
import { VehiclesPage } from './pages/VehiclesPage';
import { VehiclesFormPage } from './pages/VehiclesFormPage';
import { Navigation } from './components/Navigation';

function App() {
  return (
    <BrowserRouter>
      <Navigation />
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/vehicles" element={<VehiclesPage />} />
        <Route path="/vehicles-create" element={<VehiclesFormPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App