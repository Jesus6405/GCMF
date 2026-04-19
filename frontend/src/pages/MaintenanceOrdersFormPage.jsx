import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getAllVehicles } from "../api/vehicles.api";
import { getAllIncidents } from "../api/incidents.api";
import { createPreventiveOrder, createCorrectiveOrder, getMaintenanceOrder, updateMaintenanceOrder } from "../api/maintenanceOrders.api";

const INITIAL_STATE = {
    vehicle: "", 
    start_date: "", 
    end_date: "",
    observations: "", 
    total_cost: 0,
    scheduled_km: "", 
    service_type: "", 
    incident: ""
};

export function MaintenanceOrdersFormPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [type, setType] = useState("preventive");
    const [vehicles, setVehicles] = useState([]);
    const [incidents, setIncidents] = useState([]);
    
    const [order, setOrder] = useState({
        vehicle: "", 
        start_date: "", 
        end_date: "", // Añadido para cumplir con el modelo
        observations: "", 
        total_cost: 0,
        scheduled_km: "", 
        service_type: "", 
        incident: ""
    });

    useEffect(() => {
        async function load() {
            const [v, i] = await Promise.all([getAllVehicles(), getAllIncidents()]);
            setVehicles(v.data);
            // Filtramos incidentes no resueltos
            setIncidents(i.data.filter(inc => inc.report_status !== "Resolved"));
            
            if (id) {
                const res = await getMaintenanceOrder(id);
                setOrder(res.data);
                setType(res.data.incident ? "corrective" : "preventive");
            }
            else {
                setOrder(INITIAL_STATE);
            }
        }
        load();
    }, [id]);

    // Lógica para vincular vehículo a incidencia en órdenes correctivas
    const handleIncidentChange = (e) => {
        const incidentId = e.target.value;
        const selectedIncident = incidents.find(inc => inc.id.toString() === incidentId);
        
        if (selectedIncident) {
            setOrder({
                ...order,
                incident: incidentId,
                vehicle: selectedIncident.vehicle // El vehículo se toma de la incidencia
            });
        } else {
            setOrder({ ...order, incident: "", vehicle: "" });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Verificación de consistencia cronológica
        const start = new Date(order.start_date);
        const end = new Date(order.end_date);

        if (end <= start) {
            alert("Error: La fecha de finalización debe ser estrictamente posterior a la fecha de inicio.");
            return;
        }

        try {
            if (id) {
                await updateMaintenanceOrder(id, order);
            } else {
                type === "preventive" ? await createPreventiveOrder(order) : await createCorrectiveOrder(order);
            }
            navigate("/maintenanceOrders");
        } catch (err) { 
            console.error(err);
            alert("Error al guardar la orden. Verifique los datos."); 
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
                        
                        {!id && (
                            <div className="type-toggle-group">
                                <button type="button" className={type === 'preventive' ? 'active' : ''} onClick={() => setType('preventive')}>PREVENTIVO</button>
                                <button type="button" className={type === 'corrective' ? 'active alert' : ''} onClick={() => setType('corrective')}>CORRECTIVO</button>
                            </div>
                        )}

                        <div className="grid-form-fields">
                            <div className="form-group">
                                <label>Unidad (Vehículo) *</label>
                                <select 
                                    value={order.vehicle} 
                                    onChange={e => setOrder({...order, vehicle: e.target.value})} 
                                    required
                                    disabled={type === "corrective"} // Bloqueado si es correctivo
                                >
                                    <option value="">{type === "corrective" ? "Seleccione incidencia primero..." : "Seleccione placa..."}</option>
                                    {vehicles.map(v => <option key={v.placa} value={v.placa}>{v.placa} - {v.brand}</option>)}
                                </select>
                                {type === "corrective" && <p style={{fontSize: '11px', color: '#666'}}>* Determinado por la incidencia seleccionada.</p>}
                            </div>
                            
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px", marginTop: "15px" }}>
                                <div className="form-group">
                                    <label>Fecha de Inicio *</label>
                                    <input type="datetime-local" value={order.start_date} onChange={e => setOrder({...order, start_date: e.target.value})} required />
                                </div>
                                <div className="form-group">
                                    <label>Fecha de Finalización *</label>
                                    <input type="datetime-local" value={order.end_date} onChange={e => setOrder({...order, end_date: e.target.value})} required />
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="form-section-card" style={{ marginTop: "20px" }}>
                        <div className="section-title"><h3>Especificaciones del {type === 'preventive' ? 'Plan' : 'Fallo'}</h3></div>
                        
                        {type === "preventive" ? (
                            <div className="grid-form-fields dual">
                                <div className="form-group">
                                    <label>Kilometraje Programado</label>
                                    <input type="number" value={order.scheduled_km} onChange={e => setOrder({...order, scheduled_km: e.target.value})} placeholder="Ej: 50000" />
                                </div>
                                <div className="form-group">
                                    <label>Tipo de Servicio</label>
                                    <input type="text" value={order.service_type} onChange={e => setOrder({...order, service_type: e.target.value})} placeholder="Ej: Cambio de Aceite" />
                                </div>
                            </div>
                        ) : (
                            <div className="form-group">
                                <label>Incidencia Relacionada *</label>
                                <select value={order.incident} onChange={handleIncidentChange} required>
                                    <option value="">Seleccione la falla reportada...</option>
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
                            <label>Costo Total de Intervención ($)</label>
                            <input 
                                type="number" 
                                className="big-cost-input" 
                                value={order.total_cost} 
                                onChange={e => setOrder({...order, total_cost: e.target.value})} 
                            />
                        </div>
                        <div className="form-group" style={{ marginTop: "15px" }}>
                            <label>Observaciones Técnicas</label>
                            <textarea rows="5" value={order.observations} onChange={e => setOrder({...order, observations: e.target.value})} placeholder="Detalles del taller o repuestos..." />
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