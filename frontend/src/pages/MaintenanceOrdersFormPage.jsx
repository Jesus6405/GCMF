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
        total_cost: 0,
        scheduled_km: "", 
        service_type: "", 
        incident: "",
        order_type: "PREVENTIVE",
        // Nuevos atributos añadidos según el modelo
        status: "PLANNING",
        estimated_budget: 0,
        man_hours: 0,
        mechanic_observations: "",
        final_odometer: ""
    });

    useEffect(() => {
        async function load() {
            const [v, i] = await Promise.all([getAllVehicles(), getAllIncidents()]);
            setVehicles(v.data);
            setIncidents(i.data.filter(inc => inc.report_status !== "Resolved" || id));
            
            if (id) {
                const res = await getMaintenanceOrder(id);
                // Aseguramos que los valores nulos del backend no rompan los inputs controlados
                const data = {
                    ...res.data,
                    end_date: res.data.end_date || "",
                    mechanic_observations: res.data.mechanic_observations || "",
                    final_odometer: res.data.final_odometer || ""
                };
                setOrder(data);
                const currentType = data.order_type === "CORRECTIVE" ? "corrective" : "preventive";
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
        
        // Modificación: Solo validamos la fecha de fin si existe (ya que en Planificación puede estar vacía)
        if (order.end_date && new Date(order.end_date) <= new Date(order.start_date)) {
            alert("Error: La fecha de finalización debe ser posterior a la de inicio.");
            return;
        }

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
                <div className="header-info">
                    <span className="breadcrumb">HU-06: {id ? 'Edición' : 'Registro'} de Orden de Mantenimiento</span>
                    <h1>Orden de mantenimiento</h1>
                </div>
            </header>

            <form onSubmit={handleSubmit} className="elaborated-form">
                
                <div className="form-main-content">
                    
                    {/* FASE 1: PLANIFICACIÓN */}
                    <section className="form-section-card">
                        <div className="section-title">
                            <span className="icon">📋</span>
                            <h3>Fase 1: Planificación General</h3>
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

                        <div className="grid-form-fields dual-column">
                            <div className="form-group">
                                <label>Unidad (Vehículo) *</label>
                                <select 
                                    value={order.vehicle} 
                                    onChange={e => setOrder({...order, vehicle: e.target.value})} 
                                    required
                                    disabled={type === "corrective" || !!id}
                                >
                                    <option value="">Seleccione placa...</option>
                                    {vehicles.map(v => <option key={v.placa} value={v.placa}>{v.placa} - {v.brand}</option>)}
                                </select>
                            </div>
                            
                            <div className="form-group">
                                <label>Estado Actual *</label>
                                <select 
                                    value={order.status} 
                                    onChange={e => setOrder({...order, status: e.target.value})} 
                                    required
                                >
                                    <option value="PLANNING">Planificación</option>
                                    <option value="EXECUTION">En Ejecución</option>
                                    <option value="CLOSURE">Cierre / Completada</option>
                                    <option value="CANCELLED">Cancelada</option>
                                </select>
                            </div>
                        </div>

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
                                <label>Presupuesto Estimado ($)</label>
                                <input 
                                    type="number" 
                                    step="0.01"
                                    value={order.estimated_budget} 
                                    onChange={e => setOrder({...order, estimated_budget: parseFloat(e.target.value) || 0})} 
                                />
                            </div>
                        </div>
                    </section>

                    {/* SECCIÓN DINÁMICA: PREVENTIVO / CORRECTIVO */}
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

                    {/* FASE 2: EJECUCIÓN TÉCNICA */}
                    {order.status !== 'PLANNING' && (
                        <section className="form-section-card">
                            <div className="section-title">
                                <span className="icon">🔧</span>
                                <h3>Fase 2: Ejecución Técnica</h3>
                            </div>
                            <div className="form-group" style={{ marginBottom: "15px" }}>
                                <label>Horas Hombre Invertidas</label>
                                <input 
                                    type="number" 
                                    step="0.5"
                                    value={order.man_hours} 
                                    onChange={e => setOrder({...order, man_hours: parseFloat(e.target.value) || 0})} 
                                    placeholder="Ej: 4.5"
                                />
                            </div>
                            <div className="form-group">
                                <label>Observaciones del Mecánico</label>
                                <textarea 
                                    rows="4" 
                                    className="login-input"
                                    value={order.mechanic_observations} 
                                    onChange={e => setOrder({...order, mechanic_observations: e.target.value})} 
                                    placeholder="Detalles de la reparación, repuestos utilizados, hallazgos..."
                                />
                            </div>
                        </section>
                    )}
                </div>

                {/* BARRA LATERAL: FASE 3 CIERRE Y FINANZAS */}
                <aside className="form-sidebar-content">
                    <div className="side-card cost-card">
                        <div className="section-title">
                            <span className="icon">💰</span>
                            <h3>Cierre y Liquidación</h3>
                        </div>
                        
                        <div className="form-group" style={{ marginBottom: "15px" }}>
                            <label>Odómetro de Cierre (Km)</label>
                            <input 
                                type="number" 
                                className="login-input"
                                value={order.final_odometer} 
                                onChange={e => setOrder({...order, final_odometer: e.target.value})} 
                                placeholder="Km al terminar"
                            />
                        </div>

                        <div className="form-group" style={{ marginBottom: "15px" }}>
                            <label>Fecha de Finalización</label>
                            <input 
                                type="datetime-local" 
                                className="login-input"
                                value={order.end_date ? order.end_date.substring(0,16) : ""} 
                                onChange={e => setOrder({...order, end_date: e.target.value})} 
                            />
                        </div>

                        <div className="form-group">
                            <label>Costo Total Real ($)</label>
                            <input 
                                type="number" 
                                className="login-input" 
                                style={{ fontSize: '1.25rem', fontWeight: '700', textAlign: 'right' }}
                                value={order.total_cost} 
                                onChange={e => setOrder({...order, total_cost: parseFloat(e.target.value) || 0})} 
                            />
                        </div>
                    </div>

                    <button type="submit" className="btn btn-save" style={{ width: '100%' }}>
                        {id ? 'ACTUALIZAR ORDEN' : 'INICIAR ORDEN'}
                    </button>
                </aside>
            </form>
        </div>
    );
}