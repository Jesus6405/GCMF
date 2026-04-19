import { useEffect, useState } from "react";
import { getAllIncidents, deleteIncident } from "../api/incidents.api";
import { IncidentCard } from "./IncidentCard";

export function IncidentsList() {
    const [incidents, setIncidents] = useState([]);

    const loadIncidents = async () => {
        const res = await getAllIncidents();
        setIncidents(res.data);
    };

    useEffect(() => {
        loadIncidents();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm("¿Desea eliminar este reporte de incidencia?")) {
            await deleteIncident(id);
            setIncidents(incidents.filter(i => i.id !== id));
        }
    };

    return (
        <div className="page-container">
            <header className="page-header">
                <h2>Historial de Incidencias / Novedades</h2>
                <p>Registro de fallas detectadas en las unidades.</p>
            </header>

            <div className="table-container">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Vehículo</th>
                            <th>Descripción</th>
                            <th>Urgencia</th>
                            <th>Estado</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {incidents.map(incident => (
                            <IncidentCard key={incident.id} incident={incident} onDelete={handleDelete} />
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}