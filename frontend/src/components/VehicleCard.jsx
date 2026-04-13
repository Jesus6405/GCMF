import { useNavigate } from "react-router-dom";

export function VehicleCard({ vehicle, onDelete }) {
    const navigate = useNavigate();

    return (
        <tr>
            <td>{vehicle.placa}</td>
            <td>{vehicle.brand}</td>
            <td>{vehicle.model}</td>
            <td>{vehicle.year}</td>
            <td>{vehicle.fuel_type}</td>
            <td>{vehicle.operational_status}</td>
            <td>{vehicle.current_km}</td>
            <td>
                <button onClick={() => navigate(`/vehicles/${vehicle.placa}`)}>
                    Editar
                </button>
                <button 
                    style={{ background: "#DC2626", color: "white", marginLeft: "5px" }} 
                    onClick={() => onDelete(vehicle.placa)}
                >
                    Eliminar
                </button>
            </td>
        </tr>
    );
}