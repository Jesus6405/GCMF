import { Link } from "react-router-dom";
import { useContext } from "react";
import AuthContext from '../context/AuthContext';

export function Navigation() {

    const { user } = useContext(AuthContext); // Para saber quién es el que está mirando

    return (
        <nav className="sidebar">
            <div className="sidebar-header">
                <div className="logo-icon">C</div>
                <div className="logo-text">
                    <h1>GCMF</h1>
                    <p>Gestión de Flotas</p>
                </div>
            </div>
            <ul className="sidebar-menu">
                <li className="menu-section">Gestión de Activos</li>
                {/* Solo Gerentes y Admins ven estos apartados */}
                {['GERENTE_FLOTA', 'ADMINISTRADOR_OPERATIVO'].includes(user?.rol) && (
                    <>
                    <li>
                        <Link to="/users" className="menu-link">Gestión de Personal</Link>
                    </li>
                    <li>
                        <Link to="/create-user" className="menu-link">Registrar Usuario</Link>
                    </li>
                    <li>
                        <Link to="/vehicles-create" className="menu-link">Registrar Vehículo</Link>
                    </li>
                    <li>
                        <Link to="/incidents-create" className="menu-link">Registrar Incidente</Link>
                    </li>
                    <li>
                        <Link to="/maintenanceOrders" className="menu-link">Órdenes de Mantenimiento</Link>
                    </li>
                    <li>
                        <Link to="/maintenanceOrders-create" className="menu-link">Registrar Órden de Mantenimiento</Link>
                    </li>
                    </>
                )}

                {/* Conductores ven registro de kilometraje */}
                {user?.rol === 'CONDUCTOR' && (
                    <>
                    <li>
                        <Link to="/odometerLog" className="menu-link">Registros de kilometraje</Link>
                    </li>
                    <li>
                        <Link to="/odometerLog-create" className="menu-link">Registrar Kilometraje</Link>
                    </li>
                    </>
                )}
            </ul>
        </nav>
    );
}