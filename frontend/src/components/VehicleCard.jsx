import { useNavigate } from "react-router-dom";

export function VehicleCard({ vehicle, onDelete }) {
    const navigate = useNavigate();

    return (
        <tr className="table-row">
            <td className="font-bold">{vehicle.placa}</td>
            <td>{vehicle.brand}</td>
            <td>{vehicle.model}</td>
            <td>{vehicle.year}</td>
            <td>{vehicle.fuel_type}</td>
            <td>
                <span className="status-badge">{vehicle.operational_status}</span>
            </td>
            <td>{vehicle.current_km} km</td>
            <td className="actions-cell">
                <button 
                    className="btn btn-edit" 
                    onClick={() => navigate(`/vehicles/${vehicle.placa}`)}
                >
                    Editar
                </button>
                <button 
                    className="btn btn-delete"
                    onClick={() => onDelete(vehicle.placa)}
                >
                    Eliminar
                </button>
            </td>
        </tr>
    );
}