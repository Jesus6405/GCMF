import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { MainPage } from './pages/MainPage';
import { VehiclesPage } from './pages/VehiclesPage';
import { VehiclesFormPage } from './pages/VehiclesFormPage';
import { OdometerLogsPage } from './pages/OdometerLogsPage';
import { OdometerLogsFormPage } from './pages/OdometerLogsFormPage';
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
            <Route path="/odometerLog" element={<OdometerLogsPage />} />
            <Route path="/odometerLog-create" element={<OdometerLogsFormPage />} />
          </Routes>
        </main> 
      </div>
    </BrowserRouter>
  );
}

export default App;