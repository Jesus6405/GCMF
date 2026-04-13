import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { MainPage } from './pages/MainPage';
import { VehiclesPage } from './pages/VehiclesPage';
import { VehiclesFormPage } from './pages/VehiclesFormPage';
import { Navigation } from './components/Navigation';

function App() {
  return (
    <BrowserRouter>
      <div className="app-layout">
        <Navigation />
        <main className="main-content"> 
          <Routes>
            <Route path="/" element={<MainPage />} />
            <Route path="/vehicles" element={<VehiclesPage />} />
            <Route path="/vehicles-create" element={<VehiclesFormPage />} />
            <Route path="/vehicles/:placa" element={<VehiclesFormPage />} />
          </Routes>
        </main> 
      </div>
    </BrowserRouter>
  );
}

export default App;