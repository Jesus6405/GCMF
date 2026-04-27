import { useEffect, useState } from "react";
import { getAllDocuments, deleteDocument } from "../api/document.api";
import { DocumentCard } from "./DocumentCard";

export function DocumentsList() {
    const [Docs, setDocs] = useState([]); 

    useEffect(() => {
        async function loadDocs() {
            try {
                const ans = await getAllDocuments();
                console.log("Respuesta de Django",ans.data);
                setDocs(ans.data);
            } catch (error) {
                console.error("Error al cargar los documentos:", error);
            }
        }
        loadDocs();
    }, []);

    const handleDelete = async (id_policy) => {
        const accepted = window.confirm("¿Estás seguro de eliminar este documento legal?");
        if (accepted) {
            try {
                await deleteDocument(id_policy);
                setDocs(Docs.filter(doc => doc.id_policy !== id_policy));
            } catch (error) {
                console.error("Error al eliminar:", error);
                alert("No se pudo eliminar el documento.");
            }
        }
    };

    return (
        <div className="page-container">
            <div className="page-header">
                <h2>Documentos Legales</h2>
                <p>Lista de pólizas, seguros y revisiones registrados en el sistema.</p>
            </div>

            <div className="table-container">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Nro. Poliza / ID</th>
                            <th>Placa del Vehículo</th>
                            <th>Tipo de documento</th>
                            <th>Fecha de Vencimiento</th>
                            <th>Descripcion</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Docs.map((doc) => (
                            <DocumentCard
                                key={doc.id_policy} 
                                doc={doc} 
                                onDelete={handleDelete}
                            />
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}