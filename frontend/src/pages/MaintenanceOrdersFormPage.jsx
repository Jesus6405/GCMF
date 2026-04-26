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
        order_type: "PREVENTIVE"
    });

    useEffect(() => {
        async function load() {
            const [v, i] = await Promise.all([getAllVehicles(), getAllIncidents()]);
            setVehicles(v.data);
            setIncidents(i.data.filter(inc => inc.report_status !== "Resolved" || id));
            
            if (id) {
                const res = await getMaintenanceOrder(id);
                setOrder(res.data);
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
        
        if (new Date(order.end_date) <= new Date(order.start_date)) {
            alert("Error: La fecha de finalización debe ser posterior a la de inicio.");
            return;
        }

        // --- LIMPIEZA DE DATOS PARA LA API ---
        const cleanedData = {
            vehicle: order.vehicle,
            start_date: order.start_date,
            end_date: order.end_date,
            total_cost: parseFloat(order.total_cost) || 0,
            observations: order.observations,
            order_type: type === "preventive" ? "PREVENTIVE" : "CORRECTIVE"
        };

        if (type === "preventive") {
            // Aseguramos que sea número y no enviamos el incident
            cleanedData.scheduled_km = parseFloat(order.scheduled_km) || 0;
            cleanedData.service_type = order.service_type;
        } else {
            // Enviamos el incident y eliminamos campos preventivos
            cleanedData.incident = order.incident || null;
        }

        try {
            if (id) {
                await updateMaintenanceOrder(id, cleanedData);
            } else {
                // El backend ya usa el mismo endpoint para ambos a través del serializer inteligente
                await createPreventiveOrder(cleanedData); 
            }
            navigate("/maintenanceOrders");
        } catch (err) { 
            console.error("Error detallado de la API:", err.response?.data);
            alert("Error al guardar la orden. Verifique la consola para más detalles."); 
        }
    };

    return (
        <div className="form-page-container">
            <header className="form-header">
                <div className="header-info">
                    <span className="breadcrumb">HU-06: {id ? 'Edición' : 'Registro'} de Orden de Mantenimiento</span>
                    <h1>Orden de mantenimiento</h1>
                </div>
            </header>

            {/* Eliminamos el estilo inline 'display: grid' para que use la clase del index.css */}
            <form onSubmit={handleSubmit} className="elaborated-form">
                
                <div className="form-main-content">
                    <section className="form-section-card">
                        <div className="section-title">
                            <span className="icon">#</span>
                            <h3>Datos de la Intervención</h3>
                        </div>
                        
                        {!id && (
                            <div className="type-toggle-group" style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                                <button 
                                    type="button" 
                                    className={`btn ${type === 'preventive' ? 'btn-edit' : 'btn-secondary'}`} 
                                    onClick={() => setType('preventive')}
                                    style={{ flex: 1 }}
                                >
                                    PREVENTIVO
                                </button>
                                <button 
                                    type="button" 
                                    className={`btn ${type === 'corrective' ? 'btn-delete' : 'btn-secondary'}`} 
                                    onClick={() => setType('corrective')}
                                    style={{ flex: 1 }}
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
                                    disabled={type === "corrective"}
                                >
                                    <option value="">Seleccione placa...</option>
                                    {vehicles.map(v => <option key={v.placa} value={v.placa}>{v.placa} - {v.brand}</option>)}
                                </select>
                            </div>
                            
                            {/* Usamos la clase dual-column que ya tiene media query en index.css */}
                            <div className="grid-form-fields dual-column" style={{ marginTop: "15px" }}>
                                <div className="form-group">
                                    <label>Fecha de Inicio *</label>
                                    <input 
                                        type="datetime-local" 
                                        value={order.start_date.substring(0,16)} 
                                        onChange={e => setOrder({...order, start_date: e.target.value})} 
                                        required 
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Fecha de Finalización *</label>
                                    <input 
                                        type="datetime-local" 
                                        value={order.end_date?.substring(0,16)} 
                                        onChange={e => setOrder({...order, end_date: e.target.value})} 
                                        required 
                                    />
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="form-section-card">
                        <div className="section-title">
                            <span className="icon">⚙️</span>
                            <h3>{type === 'preventive' ? 'Especificaciones Preventivas' : 'Detalle de Incidencia'}</h3>
                        </div>
                        
                        {type === "preventive" ? (
                            <div className="grid-form-fields dual-column">
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
                                    disabled={!!id}
                                >
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
                        <div className="section-title">
                            <span className="icon">💰</span>
                            <h3>Resumen Financiero</h3>
                        </div>
                        <div className="form-group">
                            <label>Costo Total ($)</label>
                            <input 
                                type="number" 
                                className="login-input" /* Reutilizamos clase de input con ancho completo */
                                style={{ fontSize: '1.25rem', fontWeight: '700', textAlign: 'right' }}
                                value={order.total_cost} 
                                onChange={e => setOrder({...order, total_cost: e.target.value})} 
                            />
                        </div>
                        <div className="form-group">
                            <label>Observaciones</label>
                            <textarea 
                                rows="5" 
                                className="login-input"
                                value={order.observations} 
                                onChange={e => setOrder({...order, observations: e.target.value})} 
                            />
                        </div>
                    </div>

                    <button type="submit" className="btn btn-save">
                        {id ? 'ACTUALIZAR ORDEN' : 'FINALIZAR REGISTRO'}
                    </button>
                </aside>
            </form>
        </div>
    );
}