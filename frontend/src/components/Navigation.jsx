import { Link } from "react-router-dom";

export function Navigation() {
    return (
        <div>
            <Link to="/">
            <h1>GCMF</h1>
            </Link>
            <Link to="/vehicles">Vehículos</Link>
            <Link to="/vehicles-create">Crear Vehículo</Link>
        </div>
    );
}