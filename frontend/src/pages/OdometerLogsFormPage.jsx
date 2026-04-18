import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getOdometerLog, createOdometerLog, updateOdometerLog } from "../api/odometerLog.api";

const INITIAL_STATE = {
    km_reading: "",
    vehicle: "", //placa
    description: ""
};

export function OdometerLogsFormPage() {
    // 2. CORRECCIÓN: Usamos la constante INITIAL_STATE
    const [OdLog, setOdLog] = useState(INITIAL_STATE);

    const navigate = useNavigate();
    const params = useParams();
    
    useEffect(() => {
        async function loadOdLog() {
            if (params.id) {
                try {
                    const res = await getOdometerLog(params.id);
                    setOdLog(res.data);
                } catch (error) {
                    console.error("Error al cargar el log:", error);
                }
            } else {
                setOdLog(INITIAL_STATE);
            }
        }
        loadOdLog();
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
            // Asegúrate de que esta sea la ruta correcta a tu lista de logs
            navigate("/odometerLog"); 
        } catch (error) {
            console.error("Error de la API:", error.response?.data || error.message);
            let mensajeError = "No se pudo guardar el Log.\n";
            if (error.response?.data) {
                for (const key in error.response.data) {
                    mensajeError += `\n- ${key}: ${error.response.data[key]}`;
                }
            }
            alert(mensajeError);
        }
    };
    
    return (
         <div className="form-page-container">
            <header className="form-header">
                <div className="header-info">
                    <span className="breadcrumb">HU-05 · Operaciones Diarias</span>
                    <h1>Registro de Odómetro</h1>
                    <p>Actualización del log de kilometraje de las unidades.</p>
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
                            {/* Ocultamos el input del ID si estamos creando uno nuevo. 
                                Solo lo mostramos como informativo si estamos editando */}
                            {params.id && (
                                <div className="form-group">
                                    <label>ID del Registro</label>
                                    <input 
                                        type="text" 
                                        value={params.id} 
                                        disabled 
                                        style={{ backgroundColor: "#e2e8f0" }}
                                    />
                                </div>
                            )}

                            <div className="form-group">
                                <label>Placa del Vehículo <span className="required">*</span></label>
                                <input 
                                    type="text" name="vehicle" 
                                    value={OdLog.vehicle} onChange={handleChange} required 
                                    disabled={params.id} // Por integridad, no deberías cambiar la placa de un log viejo
                                />
                            </div>
                            
                            <div className="form-group">
                                <label>Kilometraje <span className="required">*</span></label>
                                {/* 3. CORRECCIÓN: type="number" */}
                                <input 
                                    type="number" name="km_reading" 
                                    placeholder="Ej: 15000" 
                                    value={OdLog.km_reading} onChange={handleChange} required 
                                />
                            </div>
                        </div>
                    </section>

                    <section className="form-section-card">
                        <div className="grid-form-fields">
                            <div className="form-group full-width">
                                <label>Descripción / Observaciones</label>
                                {/* 4. CORRECCIÓN: type="text" en lugar de "number" */}
                                <input 
                                    type="text" name="description" 
                                    placeholder="Escribe alguna novedad si la hay..."
                                    value={OdLog.description} onChange={handleChange}  
                                />
                            </div>
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