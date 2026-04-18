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
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import CrearUsuario from './pages/CreateUser';
import Unauthorized from './pages/Unauthorized';
import ProtectedRoute from './components/ProtectedRoute';
import UsuariosLista from './pages/UsuariosLista';

function App() {
  return (
    <Router>
      <Routes>
        {/* Rutas Públicas */}
        <Route path="/login" element={<Login />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* Rutas Protegidas - Cualquier usuario autenticado */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={['GERENTE_FLOTA', 'ADMINISTRADOR_OPERATIVO']}/>}>
          <Route path="/usuarios" element={<UsuariosLista />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={['GERENTE_FLOTA', 'ADMINISTRADOR_OPERATIVO']}/>}>
          <Route path="/crear_usuario" element={<CrearUsuario />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={['GERENTE_FLOTA', 'ADMINISTRADOR_OPERATIVO']}/>}>
          <Route path="/editar_usuario/:id" element={<CrearUsuario />} />
        </Route>

        {/* Redirección por defecto */}
        <Route path="/" element={<Navigate to="/dashboard" />} />
        <Route path="*" element={<h1>404 - Not Found</h1>} />
      </Routes>
    </Router>
  );
}

export default App;
