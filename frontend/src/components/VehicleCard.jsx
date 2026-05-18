import { useNavigate } from "react-router-dom";
import { AlertBadge } from "./AlertBadge";

export function VehicleCard({ vehicle, onDelete }) {
    const navigate = useNavigate();

    return (
        <tr className="table-row">
            <td>
                {vehicle.vehicle_photo ? (
                    <img 
                        src={vehicle.vehicle_photo} 
                        alt={vehicle.placa} 
                        style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px', border: '1px solid #ddd' }} 
                    />
                ) : (
                    <div style={{ width: '40px', height: '40px', backgroundColor: '#f0f0f0', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', border: '1px solid #ddd' }}>
                        🚗
                    </div>
                )}
            </td>
            <td className="font-bold">{vehicle.placa}</td>
            <td>{vehicle.brand}</td>
            <td>{vehicle.model}</td>
            <td>{vehicle.year}</td>
            <td>{vehicle.fuel_type}</td>
            <td>
                <span className="status-badge">{vehicle.operational_status}</span>
            </td>
            <td>
                <AlertBadge type="legal" status={vehicle.legal_status} />
            </td>
            <td>
                <AlertBadge type="maintenance" status={vehicle.maintenance_status} />
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