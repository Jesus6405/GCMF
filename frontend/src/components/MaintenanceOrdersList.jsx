import { useEffect, useState } from "react";
import { getAllMaintenanceOrders, deleteMaintenanceOrder } from "../api/maintenanceOrders.api";
import { MaintenanceOrderCard } from "./MaintenanceOrderCard";

export function MaintenanceOrdersList() {
    const [maintenanceOrders, setMaintenanceOrders] = useState([]);

    const loadMaintenances = async () => {
        try {
            const res = await getAllMaintenanceOrders();
            setMaintenanceOrders(res.data);
        } catch (error) {
            console.error("Error cargando mantenimientos:", error);
        }
    };

    useEffect(() => {
        loadMaintenances();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm("¿Está seguro de eliminar este registro de mantenimiento?")) {
            await deleteMaintenanceOrder(id);
            setMaintenanceOrders(maintenanceOrders.filter(m => m.id !== id));
        }
    };

    return (
        <div className="page-container">
            <header className="page-header">
                <div>
                    <h2 style={{ color: "var(--azul-industrial)" }}>Historial de Mantenimientos</h2>
                    <p style={{ color: "var(--gris-pizarra)" }}>Registro unificado de intervenciones preventivas y correctivas.</p>
                </div>
            </header>

            <div className="table-container" style={{ marginTop: "20px" }}>
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Vehículo</th>
                            <th>Tipo</th>
                            <th>Fecha Inicio</th>
                            <th>Fecha Fin</th>
                            <th>Costo Total</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {maintenanceOrders.length > 0 ? (
                            maintenanceOrders.map((m) => (
                                <MaintenanceOrderCard 
                                    key={m.id} 
                                    maintenanceOrder={m} 
                                    onDelete={handleDelete} 
                                />
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" style={{ textAlign: "center", padding: "20px" }}>
                                    No hay mantenimientos registrados.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}