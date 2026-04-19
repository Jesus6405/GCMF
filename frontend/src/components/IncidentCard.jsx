import { useNavigate } from "react-router-dom";

export function IncidentCard({ incident, onDelete }) {
    const navigate = useNavigate();

    // Colores según el nivel de urgencia 
    const urgencyStyles = {
        Low: { color: "#10B981", bg: "#D1FAE5", label: "Leve" },
        Moderate: { color: "#F59E0B", bg: "#FFEDD5", label: "Moderada" },
        Critical: { color: "#DC2626", bg: "#FEE2E2", label: "Crítica" }
    };

    const style = urgencyStyles[incident.urgency_level] || urgencyStyles.Low;

    return (
        <tr className="table-row">
            <td className="font-bold">#{incident.id}</td>
            <td>{incident.vehicle_details?.placa || incident.vehicle}</td>
            <td className="truncate-text" title={incident.description}>
                {incident.description.substring(0, 50)}...
            </td>
            <td>
                <span className="status-badge" style={{ color: style.color, backgroundColor: style.bg }}>
                    {style.label}
                </span>
            </td>
            <td>{incident.report_status}</td>
            <td className="actions-cell">
                <button className="btn btn-edit" onClick={() => navigate(`/incidents/${incident.id}`)}>
                    Ver Detalle
                </button>
                <button className="btn btn-delete" onClick={() => onDelete(incident.id)}>
                    Eliminar
                </button>
            </td>
        </tr>
    );
}