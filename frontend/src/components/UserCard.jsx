import { useNavigate } from "react-router-dom";
import AuthContext from '../context/AuthContext';
import { useContext } from "react";

export function UserCard({ listUser, onDelete }) {
    const navigate = useNavigate();
    const { user } = useContext(AuthContext); // Para saber quién es el que está mirando

    return (
        <tr className="table-row">
            <td className="font-bold">{listUser.id}</td>
            <td>{listUser.email}</td>
            <td>{listUser.nombre}</td>
            <td>
                <span className="status-badge">{listUser.rol}</span>
            </td>
            <td className="actions-cell">
                <button 
                    className="btn btn-edit" 
                    onClick={() => navigate(`/edit-user/${listUser.id}`)}
                >
                    Editar
                </button>
                
                {/* Renderizado condicional: Solo el Gerente puede borrar */}
                {user.rol === 'GERENTE_FLOTA' && listUser.email !== user.email && (
                    <button 
                    className="btn btn-delete"
                    onClick={() => onDelete(listUser.id)}
                    >
                    Eliminar
                    </button>
                )}
            </td>
        </tr>
    );
}