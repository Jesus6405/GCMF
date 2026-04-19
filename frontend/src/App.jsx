import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { VehiclesPage } from './pages/VehiclesPage';
import { VehiclesFormPage } from './pages/VehiclesFormPage';
import { OdometerLogsPage } from './pages/OdometerLogsPage';
import { OdometerLogsFormPage } from './pages/OdometerLogsFormPage';
import { IncidentsPage } from './pages/IncidentsPage';
import { IncidentsFormPage } from './pages/IncidentsFormPage';
import { MaintenanceOrdersPage } from './pages/MaintenanceOrdersPage';
import { MaintenanceOrdersFormPage } from './pages/MaintenanceOrdersFormPage';
import { Navigation } from './components/Navigation';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import CrearUsuario from './pages/CreateUser';
import Unauthorized from './pages/Unauthorized';
import ProtectedRoute from './components/ProtectedRoute';
import UsuariosLista from './pages/UsuariosLista';

function App() {
  return (
    <BrowserRouter>
      <div className="app-layout">
        <Routes>
          {/* --- NIVEL 0: RUTAS PÚBLICAS (Sin Nav) --- */}
          <Route path="/login" element={<Login />} />
          <Route path="/unauthorized" element={<Unauthorized />} />

          {/* --- NIVEL 1: RUTAS PROTEGIDAS CON NAVEGACIÓN --- */}
          {/* Envolvemos todas las rutas que REQUIEREN estar logueado y USAN el Nav */}
          <Route element={
            <ProtectedRoute>
              <Navigation /> 
              <main className="main-content">
                <Outlet /> 
              </main>
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
              <Route path="/usuarios" element={<UsuariosLista />} />
              <Route path="/crear_usuario" element={<CrearUsuario />} />
              <Route path="/editar_usuario/:id" element={<CrearUsuario />} />
              <Route path="/vehicles" element={<VehiclesPage />} />
              <Route path="/vehicles-create" element={<VehiclesFormPage />} />
              <Route path="/vehicles/:placa" element={<VehiclesFormPage />} />
              <Route path="/incidents" element={<IncidentsPage />} />
              <Route path="/incidents-create" element={<IncidentsFormPage />} />
              <Route path="/incidents/:id" element={<IncidentsFormPage />} />
              <Route path="/maintenanceOrders" element={<MaintenanceOrdersPage />} />
              <Route path="/maintenanceOrders-create" element={<MaintenanceOrdersFormPage />} />
              <Route path="/maintenanceOrders/:id" element={<MaintenanceOrdersFormPage />} />
            </Route>
          </Route>

          {/* 404 */}
          <Route path="*" element={<h1>404 - Not Found</h1>} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;