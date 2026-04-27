import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { VehiclesPage } from './pages/VehiclesPage';
import { VehiclesFormPage } from './pages/VehiclesFormPage';
import { OdometerLogsPage } from './pages/OdometerLogsPage';
import { OdometerLogsFormPage } from './pages/OdometerLogsFormPage';
import { IncidentsPage } from './pages/IncidentsPage';
import { IncidentsFormPage } from './pages/IncidentsFormPage';
import { MaintenanceOrdersPage } from './pages/MaintenanceOrdersPage';
import { MaintenanceOrdersFormPage } from './pages/MaintenanceOrdersFormPage';
import { NotificationsPage } from './pages/NotificationsPage';
import { DocumentsPage } from './pages/DocumentsPage';
import { DocumentsFormPage } from './pages/DocumentFormPage';
import { Navigation } from './components/Navigation';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import UsersFormPage from './pages/UsersFormPage';
import Unauthorized from './pages/Unauthorized';
import ProtectedRoute from './components/ProtectedRoute';
import { UsersPage } from './pages/UsersPage';
import { useState } from 'react'; 


function App() {
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <BrowserRouter>
      <Routes>
        {/* --- NIVEL 0: RUTAS PÚBLICAS (Libres del grid app-layout) --- */}
        <Route path="/login" element={<Login />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* --- NIVEL 1: RUTAS PROTEGIDAS CON NAVEGACIÓN --- */}
        <Route element={
          <ProtectedRoute>
            <div className="app-layout">
              
              {/* BOTÓN HAMBURGUESA (Solo visible en CSS móvil) */}
              <button 
                className="mobile-menu-btn"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              >
                {/* Si está abierto muestra una X, si no, las 3 rayitas */}
                {isSidebarOpen ? '✕' : '☰'} 
              </button>

              {/* OVERLAY OSCURO (Al hacerle clic, se cierra el menú) */}
              <div 
                className={`sidebar-overlay ${isSidebarOpen ? 'open' : ''}`}
                onClick={() => setIsSidebarOpen(false)}
              ></div>

              {/* Le pasamos al Navigation la instrucción de si está abierto y cómo cerrarse */}
              <Navigation isOpen={isSidebarOpen} closeMenu={() => setIsSidebarOpen(false)} /> 
              
              <main className="main-content">
                <Outlet /> 
              </main>
            </div>
          </ProtectedRoute>
        }>
          {/* Dashboard para todos */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/" element={<Navigate to="/dashboard" />} />
          <Route path="/notifications" element={<NotificationsPage />} />

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
              <Route path="/maintenanceOrders" element={<MaintenanceOrdersPage />} />
              <Route path="/maintenanceOrders-create" element={<MaintenanceOrdersFormPage />} />
              <Route path="/maintenanceOrders/:id" element={<MaintenanceOrdersFormPage />} />
              <Route path="/documents" element={<DocumentsPage />} />
              <Route path="/documents-create" element={<DocumentsFormPage />} />
              <Route path="/documents/:id_policy" element={<DocumentsFormPage />} />
            </Route>
          
        </Route>

        {/* 404 */}
        <Route path="*" element={<h1>404 - Not Found</h1>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;