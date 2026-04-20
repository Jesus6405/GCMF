import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getAllVehicles } from "../api/vehicles.api";
import { getAllIncidents } from "../api/incidents.api";
import { 
    createPreventiveOrder, 
    createCorrectiveOrder, 
    getMaintenanceOrder, 
    updateMaintenanceOrder 
} from "../api/maintenanceOrders.api";

export function MaintenanceOrdersFormPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    
    // El tipo se maneja internamente como 'preventive' o 'corrective' para la UI
    const [type, setType] = useState("preventive");
    const [vehicles, setVehicles] = useState([]);
    const [incidents, setIncidents] = useState([]);
    
    const [order, setOrder] = useState({
        vehicle: "", 
        start_date: "", 
        end_date: "", 
        observations: "", 
        total_cost: 0,
        scheduled_km: "", 
        service_type: "", 
        incident: "",
        order_type: "PREVENTIVE" // Valor por defecto
    });

    useEffect(() => {
        async function load() {
            const [v, i] = await Promise.all([getAllVehicles(), getAllIncidents()]);
            setVehicles(v.data);
            setIncidents(i.data.filter(inc => inc.report_status !== "Resolved" || id)); // Permitir el incidente actual si es edición
            
            if (id) {
                const res = await getMaintenanceOrder(id);
                setOrder(res.data);
                // Sincronizamos el estado de la UI con el tipo real de la orden
                const currentType = res.data.order_type === "CORRECTIVE" ? "corrective" : "preventive";
                setType(currentType);
            }
        }
        load();
    }, [id]);

    const handleIncidentChange = (e) => {
        const incidentId = e.target.value;
        const selectedIncident = incidents.find(inc => inc.id.toString() === incidentId);
        
        if (selectedIncident) {
            setOrder({
                ...order,
                incident: incidentId,
                vehicle: selectedIncident.vehicle
            });
        } else {
            setOrder({ ...order, incident: "", vehicle: "" });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validación cronológica
        if (new Date(order.end_date) <= new Date(order.start_date)) {
            alert("Error: La fecha de finalización debe ser posterior a la de inicio.");
            return;
        }

        // Preparamos los datos incluyendo el order_type correcto para el backend
        const dataToSend = {
            ...order,
            order_type: type === "preventive" ? "PREVENTIVE" : "CORRECTIVE"
        };

        try {
            if (id) {
                await updateMaintenanceOrder(id, dataToSend);
            } else {
                type === "preventive" 
                    ? await createPreventiveOrder(dataToSend) 
                    : await createCorrectiveOrder(dataToSend);
            }
            navigate("/maintenanceOrders");
        } catch (err) { 
            console.error(err);
            alert("Error al guardar la orden."); 
        }
    };

    return (
        <div className="form-page-container">
            <header className="form-header">
                <span className="breadcrumb">MANTENIMIENTO · {id ? 'EDICIÓN' : 'REGISTRO'}</span>
                <h1>Orden de Trabajo #{id || 'NUEVA'}</h1>
            </header>

            <form onSubmit={handleSubmit} className="elaborated-form" style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "25px" }}>
                
                <div className="form-main-content">
                    <section className="form-section-card">
                        <div className="section-title"><h3>Datos de la Intervención</h3></div>
                        
                        {/* El selector de tipo solo aparece si estamos creando una orden nueva */}
                        {!id && (
                            <div className="type-toggle-group">
                                <button 
                                    type="button" 
                                    className={type === 'preventive' ? 'active' : ''} 
                                    onClick={() => setType('preventive')}
                                >
                                    PREVENTIVO
                                </button>
                                <button 
                                    type="button" 
                                    className={type === 'corrective' ? 'active alert' : ''} 
                                    onClick={() => setType('corrective')}
                                >
                                    CORRECTIVO
                                </button>
                            </div>
                        )}

                        <div className="grid-form-fields">
                            <div className="form-group">
                                <label>Unidad (Vehículo) *</label>
                                <select 
                                    value={order.vehicle} 
                                    onChange={e => setOrder({...order, vehicle: e.target.value})} 
                                    required
                                    disabled={type === "corrective"} // Bloqueado si es correctivo (viene de incidencia)
                                >
                                    <option value="">Seleccione placa...</option>
                                    {vehicles.map(v => <option key={v.placa} value={v.placa}>{v.placa} - {v.brand}</option>)}
                                </select>
                            </div>
                            
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px", marginTop: "15px" }}>
                                <div className="form-group">
                                    <label>Fecha de Inicio *</label>
                                    <input type="datetime-local" value={order.start_date.substring(0,16)} onChange={e => setOrder({...order, start_date: e.target.value})} required />
                                </div>
                                <div className="form-group">
                                    <label>Fecha de Finalización *</label>
                                    <input type="datetime-local" value={order.end_date?.substring(0,16)} onChange={e => setOrder({...order, end_date: e.target.value})} required />
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="form-section-card" style={{ marginTop: "20px" }}>
                        <div className="section-title">
                            <h3>{type === 'preventive' ? 'Especificaciones Preventivas' : 'Detalle de Incidencia'}</h3>
                        </div>
                        
                        {type === "preventive" ? (
                            <div className="grid-form-fields dual">
                                <div className="form-group">
                                    <label>Kilometraje Programado</label>
                                    <input 
                                        type="number" 
                                        value={order.scheduled_km} 
                                        onChange={e => setOrder({...order, scheduled_km: e.target.value})} 
                                        placeholder="Ej: 50000" 
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Tipo de Servicio</label>
                                    <input 
                                        type="text" 
                                        value={order.service_type} 
                                        onChange={e => setOrder({...order, service_type: e.target.value})} 
                                        placeholder="Ej: Cambio de Aceite" 
                                    />
                                </div>
                            </div>
                        ) : (
                            <div className="form-group">
                                <label>Incidencia Relacionada *</label>
                                <select 
                                    value={order.incident} 
                                    onChange={handleIncidentChange} 
                                    required
                                    // disabled={!!id} // Una orden correctiva no puede cambiar de incidencia vinculada
                                >
                                    <option value="">Seleccione la falla...</option>
                                    {incidents.map(inc => (
                                        <option key={inc.id} value={inc.id}>
                                            #{inc.id} - {inc.vehicle}: {inc.description.substring(0, 40)}...
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}
                    </section>
                </div>

                <aside className="form-sidebar-content">
                    <div className="side-card cost-card">
                        <div className="section-title"><h3>Resumen Financiero</h3></div>
                        <div className="form-group">
                            <label>Costo Total ($)</label>
                            <input 
                                type="number" 
                                className="big-cost-input" 
                                value={order.total_cost} 
                                onChange={e => setOrder({...order, total_cost: e.target.value})} 
                            />
                        </div>
                        <div className="form-group" style={{ marginTop: "15px" }}>
                            <label>Observaciones</label>
                            <textarea 
                                rows="5" 
                                value={order.observations} 
                                onChange={e => setOrder({...order, observations: e.target.value})} 
                            />
                        </div>
                    </div>

                    <button type="submit" className="btn btn-save-full">
                        {id ? 'ACTUALIZAR ORDEN' : 'FINALIZAR REGISTRO'}
                    </button>
                </aside>
            </form>
        </div>
    );
}