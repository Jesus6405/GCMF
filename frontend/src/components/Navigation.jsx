import { Link } from "react-router-dom";

export function Navigation() {
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
                <li>
                    <Link to="/vehicles" className="menu-link">Inventario de Unidades</Link>
                </li>
                <li>
                    <Link to="/vehicles-create" className="menu-link">Registrar Vehículo</Link>
                </li>
            </ul>
        </nav>
    );
}