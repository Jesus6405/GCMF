import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getIncident, createIncident, updateIncident } from "../api/incidents.api";
import { getAllVehicles } from "../api/vehicles.api";

const INITIAL_STATE = {
    vehicle: "",
    description: "",
    urgency_level: "Low",
    report_status: "Pending"
};

export function IncidentsFormPage() {
    const [incident, setIncident] = useState({
        vehicle: "",
        description: "",
        urgency_level: "Low",
        report_status: "Pending"
    });
    const [vehicles, setVehicles] = useState([]);
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchData() {
            const vRes = await getAllVehicles();
            setVehicles(vRes.data);
            
            if (id) {
                const iRes = await getIncident(id);
                setIncident(iRes.data);
            } else {
                setIncident(INITIAL_STATE);
            }
        }
        fetchData();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        id ? await updateIncident(id, incident) : await createIncident(incident);
        navigate("/incidents");
    };

    return (
        <div className="form-page-container">
            <header className="form-header">
                <span className="breadcrumb">HU-04 · Reporte de Fallas</span>
                <h1>{id ? "Editar Incidencia" : "Reportar Incidencia"}</h1>
            </header>

            <form onSubmit={handleSubmit} className="elaborated-form">
                <div className="form-main-content">
                    <section className="form-section-card">
                        <h3>Información del Reporte</h3>
                        <div className="grid-form-fields dual-column">
                            <div className="form-group">
                                <label>Vehículo (Placa) *</label>
                                <select 
                                    value={incident.vehicle} 
                                    onChange={e => setIncident({...incident, vehicle: e.target.value})}
                                    required
                                >
                                    <option value="">-- Seleccionar unidad --</option>
                                    {vehicles.map(v => <option key={v.placa} value={v.placa}>{v.placa} - {v.brand}</option>)}
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Nivel de Urgencia *</label>
                                <select 
                                    value={incident.urgency_level} 
                                    onChange={e => setIncident({...incident, urgency_level: e.target.value})}
                                >
                                    <option value="Low">Leve (Sin riesgo)</option>
                                    <option value="Moderate">Moderada (Supervisar)</option>
                                    <option value="Critical">Crítica (¡Peligro! - Bloquea unidad )</option>
                                </select>
                            </div>
                        </div>
                        <div className="form-group full-width" style={{marginTop: "15px"}}>
                            <label>Descripción de la Falla *</label>
                            <textarea 
                                rows="4"
                                value={incident.description}
                                onChange={e => setIncident({...incident, description: e.target.value})}
                                placeholder="Describa con detalle: ¿Cuándo ocurre? ¿Hay ruidos?..."
                                required
                            />
                        </div>
                    </section>
                    <button type="submit" className="btn btn-save">Enviar Reporte</button>
                </div>
            </form>
        </div>
    );
}