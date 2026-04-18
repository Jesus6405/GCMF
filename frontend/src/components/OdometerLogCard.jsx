import { useNavigate } from "react-router-dom";

export function OdometerLogCard({ odLog, onDelete }) {
    const navigate = useNavigate();

    // ESCUDO PROTECTOR: Si odLog es undefined, no intenta dibujar la tabla y evita que la pantalla se quede en blanco.
    if (!odLog) return null;

    return (
        <tr className="table-row">
            {/* Asegúrate de que todas tengan la "L" mayúscula: odLog */}
            <td className="font-bold">{odLog.id}</td>
            <td>{odLog.km_reading} km</td>
            <td>{new Date(odLog.recorded_at).toLocaleDateString()}</td>
            <td>{odLog.vehicle}</td>
            <td>{odLog.description || "N/A"}</td>
            <td className="actions-cell">
                <button 
                    className="btn btn-edit" 
                    onClick={() => navigate(`/odometerLog/${odLog.id}`)}
                >
                    Editar
                </button>
                <button 
                    className="btn btn-delete"
                    onClick={() => onDelete(odLog.id)}
                >
                    Eliminar
                </button>
            </td>
        </tr>
    );
}