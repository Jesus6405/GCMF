import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getVehicle, createVehicle, updateVehicle } from "../api/vehicles.api";


const INITIAL_STATE = {
    placa: "",
    brand: "",
    model: "",
    year: "",
    fuel_type: "Gasoline",
    current_km: "",
    operational_status: "Operational"
};

export function VehiclesFormPage() {
    const [vehicle, setVehicle] = useState({
        placa: "",
        brand: "",
        model: "",
        year: "",
        fuel_type: "Gasoline", 
        current_km: "",
        operational_status: "Operational" 
    });
    
    const navigate = useNavigate();
    const params = useParams();

    useEffect(() => {
        async function loadVehicle() {
            if (params.placa) {
                try {
                    const res = await getVehicle(params.placa);
                    setVehicle(res.data);
                } catch (error) {
                    console.error("Error al cargar el vehículo:", error);
                }
            } else {
                setVehicle(INITIAL_STATE);//Si la url no lleva un vehiculo limpia el formulario
            }
        }
        loadVehicle();
    }, [params.placa]);

    const handleChange = (e) => {
        const { name, value, type } = e.target;
        const parsedValue = type === "number" ? (value === "" ? "" : Number(value)) : value;
        setVehicle({ ...vehicle, [name]: parsedValue });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (params.placa) {
                await updateVehicle(params.placa, vehicle);
            } else {
                await createVehicle(vehicle);
            }
            navigate("/vehicles");
        } catch (error) {
            console.error("Error de la API:", error.response?.data || error.message);
            let mensajeError = "No se pudo guardar el vehículo.\n";
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
                    <span className="breadcrumb">HU-01 · RF-01 · Registro de Activos</span>
                    <h1>Registro de Vehículo</h1>
                    <p>La placa es la llave primaria única del sistema.</p>
                </div>
            </header>

            <form onSubmit={handleSubmit} className="elaborated-form">
                <div className="form-main-content">
                    <section className="form-section-card">
                        <div className="section-title">
                            <span className="icon">#</span>
                            <h3>Datos de Identificación</h3>
                        </div>
                        <div className="grid-form-fields dual-column">
                            <div className="form-group">
                                <label>Número de Placa <span className="required">*</span></label>
                                <input 
                                    type="text" name="placa" 
                                    placeholder="ABC-123" 
                                    value={vehicle.placa} onChange={handleChange} 
                                    required disabled={params.placa}
                                />
                            </div>
                            
                            <div className="form-group">
                                <label>Estado Operativo <span className="required">*</span></label>
                                <select name="operational_status" value={vehicle.operational_status} onChange={handleChange} required>
                                    {/* El valor del 'value' debe coincidir con el primer elemento de la tupla en Django */}
                                    <option value="Operational">Operativo</option>
                                    <option value="In Workshop">En Taller</option>
                                    <option value="Under Review">Bajo Revisión</option>
                                    <option value="Unfit">No Apto</option>
                                </select>
                            </div>
                        </div>
                    </section>

                    <section className="form-section-card">
                        <div className="section-title">
                            <span className="icon">⚙️</span>
                            <h3>Datos Técnicos del Vehículo</h3>
                        </div>
                        <div className="grid-form-fields dual-column">
                            <div className="form-group">
                                <label>Marca <span className="required">*</span></label>
                                <input 
                                    type="text" name="brand" 
                                    placeholder="Ej: Toyota, Ford..." 
                                    value={vehicle.brand} onChange={handleChange} required 
                                />
                            </div>
                            <div className="form-group">
                                <label>Modelo <span className="required">*</span></label>
                                <input 
                                    type="text" name="model" 
                                    placeholder="Ej: Hilux, Transit..." 
                                    value={vehicle.model} onChange={handleChange} required 
                                />
                            </div>
                            <div className="form-group">
                                <label>Año <span className="required">*</span></label>
                                <input 
                                    type="number" name="year" 
                                    value={vehicle.year} onChange={handleChange} required 
                                />
                            </div>
                            <div className="form-group">
                                <label>Tipo de Combustible <span className="required">*</span></label>
                                <select name="fuel_type" value={vehicle.fuel_type} onChange={handleChange} required>
                                    <option value="Gasoline">Gasolina</option>
                                    <option value="Diesel">Diésel</option>
                                    <option value="Gas">Gas</option>
                                </select>
                            </div>
                            <div className="form-group full-width">
                                <label>Kilometraje Inicial <span className="required">*</span></label>
                                <input 
                                    type="number" name="current_km" 
                                    value={vehicle.current_km} onChange={handleChange} required 
                                />
                            </div>
                        </div>
                    </section>
                    
                    <div className="form-submit-zone">
                        <button type="submit" className="btn btn-save">
                            {params.placa ? "Actualizar Vehículo" : "Guardar Registro"}
                        </button>
                    </div>
                </div>

                <aside className="form-sidebar-content">
                    <div className="side-card photo-placeholder">
                        <div className="section-title">
                            <span className="icon">📷</span>
                            <h3>Fotografía del Vehículo</h3>
                        </div>
                        <div className="upload-box">
                            <p>Subida de imágenes no disponible en esta fase.</p>
                        </div>
                    </div>
                </aside>
            </form>
        </div>
    );
}