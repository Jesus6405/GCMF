import { useNavigate } from "react-router-dom";

export function DocumentCard({ doc, onDelete }) {
    const navigate = useNavigate();

    // Si doc es undefined, no intenta dibujar la tabla y evita que la pantalla se quede en blanco.
    if (!doc) return null;

    return (
        <tr className="table-row">
            <td className="font-bold">{doc.id_policy}</td>
            <td>{doc.vehicle}</td>
            <td>{doc.document_type}</td>
            <td>{doc.date_end}</td>
            <td>{doc.description || "N/A"}</td>
            <td className="actions-cell">
                <button 
                    className="btn btn-edit" 
                    onClick={() => navigate(`/documents/${encodeURIComponent(doc.id_policy)}`)}
                >
                    Editar
                </button>
                <button 
                    className="btn btn-delete"
                    onClick={() => onDelete(doc.id_policy)}
                >
                    Eliminar
                </button>
            </td>
        </tr>
    );
}