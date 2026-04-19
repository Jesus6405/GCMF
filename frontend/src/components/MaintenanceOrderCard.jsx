import { useNavigate } from "react-router-dom";

export function MaintenanceOrderCard({ maintenanceOrder, onDelete }) {
    const navigate = useNavigate();

    // Determinamos si es preventivo o correctivo para el estilo
    // (Asumiendo que el backend envía un campo 'type' o verificando campos únicos)
    const isCorrective = !!maintenanceOrder.incident; 
    
    const typeLabel = isCorrective ? "Correctivo" : "Preventivo";
    const typeColor = isCorrective ? "var(--rojo-carmesi)" : "var(--azul-electrico)";
    const typeBg = isCorrective ? "#FEE2E2" : "#DBEAFE";

    return (
        <tr className="table-row">
            <td className="font-bold">#{maintenanceOrder.id}</td>
            <td>{maintenanceOrder.vehicle}</td>
            <td>
                <span style={{ 
                    padding: "4px 10px", 
                    borderRadius: "6px", 
                    fontSize: "12px", 
                    fontWeight: "600",
                    color: typeColor,
                    backgroundColor: typeBg
                }}>
                    {typeLabel}
                </span>
            </td>
            <td>{new Date(maintenanceOrder.start_date).toLocaleDateString()}</td>
            <td>{maintenanceOrder.end_date ? new Date(maintenanceOrder.end_date).toLocaleDateString() : "En curso"}</td>
            <td className="font-bold">${maintenanceOrder.total_cost.toLocaleString()}</td>
            <td>
                <div style={{ display: "flex", gap: "8px" }}>
                    <button 
                        className="btn btn-edit"
                        onClick={() => navigate(`/maintenanceOrders/${maintenanceOrder.id}`)}
                    >
                        Detalle
                    </button>
                    <button 
                        className="btn btn-delete"
                        onClick={() => onDelete(maintenanceOrder.id)}
                    >
                        Eliminar
                    </button>
                </div>
            </td>
        </tr>
    );
}