import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { VehiclesPage } from './pages/VehiclesPage';
import { VehiclesFormPage } from './pages/VehiclesFormPage';
import { OdometerLogsPage } from './pages/OdometerLogsPage';
import { OdometerLogsFormPage } from './pages/OdometerLogsFormPage';
import { IncidentsPage } from './pages/IncidentsPage';
import { IncidentsFormPage } from './pages/IncidentsFormPage';
import { Navigation } from './components/Navigation';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import UsersFormPage from './pages/UsersFormPage';
import Unauthorized from './pages/Unauthorized';
import ProtectedRoute from './components/ProtectedRoute';
import { UsersPage } from './pages/UsersPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* --- NIVEL 0: RUTAS PÚBLICAS (Libres del grid app-layout) --- */}
        <Route path="/login" element={<Login />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* --- NIVEL 1: RUTAS PROTEGIDAS CON NAVEGACIÓN --- */}
        <Route element={
          <ProtectedRoute>
            <div className="app-layout">{/*app layout para el css grid que centra el formulario*/}
              <Navigation /> 
              <main className="main-content">
                <Outlet /> 
              </main>
            </div>
          </ProtectedRoute>
        }>
          {/* Dashboard para todos */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/" element={<Navigate to="/dashboard" />} />

          {/* Rutas para Conductores */}
          <Route path="/odometerLog" element={<OdometerLogsPage />} />
          <Route path="/odometerLog-create" element={<OdometerLogsFormPage />} />
          <Route path="/odometerLog/:id" element={<OdometerLogsFormPage />} />

          {/* --- NIVEL 2: SOLO STAFF (Admin y Gerente) --- */}
          <Route element={<ProtectedRoute allowedRoles={['GERENTE_FLOTA', 'ADMINISTRADOR_OPERATIVO']}/>}>
            <Route path="/users" element={<UsersPage />} />
            <Route path="/create-user" element={<UsersFormPage />} />
            <Route path="/edit-user/:id" element={<UsersFormPage />} />
            <Route path="/vehicles" element={<VehiclesPage />} />
            <Route path="/vehicles-create" element={<VehiclesFormPage />} />
            <Route path="/vehicles/:placa" element={<VehiclesFormPage />} />
            <Route path="/incidents" element={<IncidentsPage />} />
            <Route path="/incidents-create" element={<IncidentsFormPage />} />
            <Route path="/incidents/:id" element={<IncidentsFormPage />} />
          </Route>
        </Route>

        {/* 404 */}
        <Route path="*" element={<h1>404 - Not Found</h1>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;