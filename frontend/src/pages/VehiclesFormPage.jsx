import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getVehicle, createVehicle, updateVehicle } from "../api/vehicles.api";

export function VehiclesFormPage() {
    const [vehicle, setVehicle] = useState({
        placa: "",
        brand: "",
        model: "",
        year: "",
        fuel_type: "",
        current_km: 0,
        operational_status: "Disponible"
    });
    
    const navigate = useNavigate();
    const params = useParams();

    useEffect(() => {
        async function loadVehicle() {
            if (params.placa) {
                const res = await getVehicle(params.placa);
                setVehicle(res.data);
            }
        }
        loadVehicle();
    }, [params.placa]);

    const handleChange = (e) => {
        setVehicle({ ...vehicle, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (params.placa) {
            await updateVehicle(params.placa, vehicle);
        } else {
            await createVehicle(vehicle);
        }
        navigate("/vehicles");
    };

    return (
        <div className="form-page-container">
            <header className="form-header">
                <div className="header-info">
                    <span className="breadcrumb">HU-01 · RF-01 · Registro de Activos</span>
                    <h1>Registro de Vehículo</h1>
                    <p>La placa es la llave primaria única del sistema.</p>
                </div>
                <div className="header-actions">
                    <button className="btn btn-secondary">Registrar Km</button>
                    <button className="btn btn-danger-outline">Reportar Falla</button>
                </div>
            </header>

            <form onSubmit={handleSubmit} className="elaborated-form">
                <div className="form-main-content">
                    {/* SECCIÓN 1: IDENTIFICACIÓN */}
                    <section className="form-section-card">
                        <div className="section-title">
                            <span className="icon">#</span>
                            <h3>Datos de Identificación</h3>
                        </div>
                        <div className="grid-form-fields">
                            <div className="form-group full-width">
                                <label>Número de Placa <span className="required">*</span></label>
                                <input 
                                    type="text" name="placa" 
                                    placeholder="ABC-123" 
                                    value={vehicle.placa} onChange={handleChange} 
                                    required disabled={params.placa}
                                />
                                <small>Formato: 3 letras + guión + 3 números</small>
                            </div>
                        </div>
                    </section>

                    {/* SECCIÓN 2: DATOS TÉCNICOS */}
                    <section className="form-section-card">
                        <div className="section-title">
                            <span className="icon">⚙️</span>
                            <h3>Datos Técnicos del Vehículo</h3>
                        </div>
                        <div className="grid-form-fields dual-column">
                            {/* CAMBIO AQUÍ: Marca ahora es un input de texto */}
                            <div className="form-group">
                                <label>Marca <span className="required">*</span></label>
                                <input 
                                    type="text" name="brand" 
                                    placeholder="Ej: Toyota, Ford, Chevrolet..." 
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
                                    <option value="">— Seleccionar —</option>
                                    <option value="Gasolina">Gasolina</option>
                                    <option value="Diesel">Diesel</option>
                                    <option value="Gas">Gas</option>
                                </select>
                            </div>
                            <div className="form-group">
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

                {/* BARRA LATERAL DEL FORMULARIO */}
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
                    
                    {/* El apartado de Documentación Legal ha sido removido temporalmente */}
                </aside>
            </form>
        </div>
    );
}