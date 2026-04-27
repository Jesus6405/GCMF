import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getDocument, createDocument, updateDocument } from "../api/document.api";

const INITIAL_STATE = {
    id_policy: "", 
    document_type: "Seguro", // Valor por defecto
    vehicle: "", // Placa del vehículo (Llave foránea)
    date_init: "",
    date_end: "",
    description: "",
    document_file: null // Campo para el archivo PDF
};

export function DocumentsFormPage() {
    const [Doc, setDoc] = useState(INITIAL_STATE);

    const navigate = useNavigate();
    const params = useParams(); 

    // Cargar el documento si estamos en modo edición (la URL tiene un id_policy)
    useEffect(() => {
        async function loadDoc() {
            if (params.id_policy) {
                try {
                    const res = await getDocument(params.id_policy);
                    setDoc(res.data);
                } catch (error) {
                    console.error("Error al cargar el documento:", error);
                }
            } else {
                setDoc(INITIAL_STATE);
            }
        }
        loadDoc();
    }, [params.id_policy]);

    // Manejar cambios en los inputs, incluyendo el input tipo "file"
    const handleChange = (e) => {
        const { name, value, type, files } = e.target;
        
        if (type === "file") {
            // Si es un archivo, guardamos el archivo físico extraído del array files
            setDoc({ ...Doc, [name]: files[0] });
        } else {
            // Si es texto o fecha, lo guardamos normal
            setDoc({ ...Doc, [name]: value });
        }
    };

    // Enviar el formulario
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Usamos FormData porque vamos a enviar un archivo (PDF)
        const formData = new FormData();
        formData.append("id_policy", Doc.id_policy);
        formData.append("document_type", Doc.document_type);
        formData.append("vehicle", Doc.vehicle);
        formData.append("date_init", Doc.date_init);
        formData.append("date_end", Doc.date_end);
        
        // La descripción es opcional
        if (Doc.description) {
            formData.append("description", Doc.description);
        }
        
        // Solo adjuntamos el archivo si el usuario seleccionó uno nuevo.
        // Si el valor es un 'string', significa que es la URL de Django y no queremos reescribirla.
        if (Doc.document_file && typeof Doc.document_file !== 'string') {
            formData.append("document_file", Doc.document_file);
        }

        try {
            if (params.id_policy) {
                // Actualizar documento existente
                await updateDocument(params.id_policy, formData);
            } else {
                // Crear nuevo documento
                await createDocument(formData);
            }
            
            // Redirigir a la tabla de documentos
            navigate("/documents"); 
        } catch (error) {
            console.error("Error de la API:", error.response?.data || error.message);
            let mensajeError = "No se pudo guardar el Documento.\n";
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
                    <span className="breadcrumb">HU-02 · Gestión de Activos</span>
                    <h1>Registro de Documento Legal</h1>
                    <p>Actualización de seguros y revisiones para control de vencimientos.</p>
                </div>
            </header>

            <form onSubmit={handleSubmit} className="elaborated-form">
                <div className="form-main-content">
                    
                    {/* SECCIÓN 1: Identificación del Documento */}
                    <section className="form-section-card">
                        <div className="section-title">
                            <span className="icon">📄</span>
                            <h3>Identificación Legal</h3>
                        </div>
                        <div className="grid-form-fields dual-column">
                            <div className="form-group">
                                <label>Número de Póliza / ID <span className="required">*</span></label>
                                <input
                                    type="text" 
                                    name="id_policy"
                                    placeholder="Ej: POL-998877"
                                    value={Doc.id_policy} 
                                    onChange={handleChange} 
                                    required
                                    disabled={params.id_policy != null} // Se bloquea al editar
                                    style={params.id_policy ? { backgroundColor: "#e2e8f0" } : {}}
                                />
                            </div>

                            <div className="form-group">
                                <label>Placa del Vehículo <span className="required">*</span></label>
                                <input
                                    type="text" 
                                    name="vehicle"
                                    placeholder="Ej: ABC-123"
                                    value={Doc.vehicle} 
                                    onChange={handleChange} 
                                    required
                                    disabled={params.id_policy != null} // Por integridad, no cambiar placa al editar
                                />
                            </div>

                            <div className="form-group">
                                <label>Tipo de Documento <span className="required">*</span></label>
                                <select 
                                    name="document_type" 
                                    value={Doc.document_type} 
                                    onChange={handleChange} 
                                    required
                                >
                                    <option value="Seguro">Seguro</option>
                                    <option value="Revision Tecnica">Revision Tecnica</option>
                                    <option value="Autorizacion">Autorizacion</option>
                                </select>
                            </div>
                        </div>
                    </section>

                    {/* SECCIÓN 2: Vigencia y Archivo */}
                    <section className="form-section-card">
                        <div className="section-title">
                            <span className="icon">📅</span>
                            <h3>Vigencia y Soporte Físico</h3>
                        </div>
                        <div className="grid-form-fields dual-column">
                            <div className="form-group">
                                <label>Fecha de Emisión <span className="required">*</span></label>
                                <input
                                    type="date" 
                                    name="date_init"
                                    value={Doc.date_init} 
                                    onChange={handleChange} 
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Fecha de Vencimiento <span className="required">*</span></label>
                                <input
                                    type="date" 
                                    name="date_end"
                                    value={Doc.date_end} 
                                    onChange={handleChange} 
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid-form-fields" style={{ marginTop: "20px" }}>
                            <div className="form-group full-width">
                                <label>Soporte Digital (PDF)</label>
                                <input
                                    type="file" 
                                    name="document_file"
                                    accept="application/pdf"
                                    onChange={handleChange}
                                    required={!params.id_policy} // Solo es obligatorio al crear
                                />
                                {params.id_policy && typeof Doc.document_file === 'string' && (
                                    <small style={{ color: "#2563EB", marginTop: "5px" }}>
                                        ✓ Ya existe un documento cargado. Sube uno nuevo solo si necesitas reemplazarlo.
                                    </small>
                                )}
                            </div>
                            
                            <div className="form-group full-width">
                                <label>Descripción / Observaciones</label>
                                <input
                                    type="text" 
                                    name="description"
                                    placeholder="Aseguradora, notas adicionales, etc..."
                                    value={Doc.description} 
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                    </section>

                    <div className="form-submit-zone">
                        <button type="submit" className="btn btn-save">
                            {params.id_policy ? "Actualizar Documento" : "Guardar Documento"}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}