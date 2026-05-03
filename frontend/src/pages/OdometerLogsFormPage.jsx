import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getOdometerLog, createOdometerLog, updateOdometerLog } from "../api/odometerLog.api";
import { getVehicle, updateVehicle, getAllVehicles } from "../api/vehicles.api"; //[cite: 34, 35]

const INITIAL_STATE = {
    km_reading: "",
    vehicle: "", 
    description: ""
};

export function OdometerLogsFormPage() {
    const [OdLog, setOdLog] = useState(INITIAL_STATE);
    const [vehicles, setVehicles] = useState([]);

    const navigate = useNavigate();
    const params = useParams();

    useEffect(() => {
        async function loadData() {
            try {
                const vRes = await getAllVehicles();
                setVehicles(vRes.data);

                if (params.id) {
                    const res = await getOdometerLog(params.id);
                    setOdLog(res.data);
                } else {
                    setOdLog(INITIAL_STATE);
                }
            } catch (error) {
                console.error("Error al cargar datos:", error);
            }
        }
        loadData();
    }, [params.id]);

    const handleChange = (e) => {
        const { name, value, type } = e.target;
        const parsedValue = type === "number" ? (value === "" ? "" : Number(value)) : value;
        setOdLog({ ...OdLog, [name]: parsedValue });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (params.id) {
                await updateOdometerLog(params.id, OdLog);
            } else {
                await createOdometerLog(OdLog);
            }
            
            const res = await getVehicle(OdLog.vehicle);
            const vehicleData = res.data;
            vehicleData.current_km = OdLog.km_reading;
            await updateVehicle(OdLog.vehicle, vehicleData);

            navigate("/odometerLog");
        } catch (error) {
            console.error("Error de la API:", error.response?.data || error.message);
            alert("No se pudo guardar el Log.");
        }
    };

    return (
        <div className="form-page-container">
            <header className="form-header">
                <div className="header-info">
                    <span className="breadcrumb">HU-05 · Registro de Odómetro</span>
                    <h1>Registro de Odómetro</h1>
                </div>
            </header>

            <form onSubmit={handleSubmit} className="elaborated-form">
                <div className="form-main-content">
                    <section className="form-section-card">
                        <div className="section-title">
                            <span className="icon">#</span>
                            <h3>Datos del Registro</h3>
                        </div>
                        <div className="grid-form-fields dual-column">
                            {params.id && (
                                <div className="form-group">
                                    <label>ID del Registro</label>
                                    <input type="text" value={params.id} disabled style={{ backgroundColor: "#e2e8f0" }} />
                                </div>
                            )}

                            <div className="form-group">
                                <label>Vehículo (Placa) <span className="required">*</span></label>
                                <select 
                                    name="vehicle"
                                    value={OdLog.vehicle} 
                                    onChange={handleChange} 
                                    required
                                    disabled={params.id} // Bloqueado en edición por integridad[cite: 35]
                                >
                                    <option value="">-- Seleccionar unidad --</option>
                                    {vehicles.map(v => (
                                        <option key={v.placa} value={v.placa}>
                                            {v.placa} - {v.brand} {v.model}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group">
                                <label>Kilometraje Actual <span className="required">*</span></label>
                                <input
                                    type="number" name="km_reading"
                                    placeholder="Ej: 15000"
                                    value={OdLog.km_reading} onChange={handleChange} required
                                />
                            </div>
                        </div>
                    </section>

                    <section className="form-section-card">
                        <div className="form-group full-width">
                            <label>Descripción / Observaciones</label>
                            <input
                                type="text" name="description"
                                placeholder="Escribe alguna novedad si la hay..."
                                value={OdLog.description} onChange={handleChange}
                            />
                        </div>
                    </section>

                    <div className="form-submit-zone">
                        <button type="submit" className="btn btn-save">
                            {params.id ? "Actualizar Log" : "Guardar Registro"}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}