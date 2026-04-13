import { useEffect, useState, useContext } from 'react';
import { getUsuarios, deleteUsuario } from '../api/users.api';
import AuthContext from '../context/AuthContext';

const UsuariosLista = () => {
    const [usuarios, setUsuarios] = useState([]);
    const { user } = useContext(AuthContext); // Para saber quién es el que está mirando

    const cargarUsuarios = async () => {
        try {
            const res = await getUsuarios();
            setUsuarios(res.data);
        } catch (error) {
            console.error("Error cargando usuarios", error);
        }
    };

    useEffect(() => {
        cargarUsuarios();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm("¿Estás seguro de eliminar este usuario?")) {
            await deleteUsuario(id);
            cargarUsuarios(); // Recargamos la lista después de borrar
        }
    };

    return (
        <div className="container">
            <h2>Personal del GCMF</h2>
            <table>
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Email</th>
                        <th>Rol</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {usuarios.map(u => (
                        <tr key={u.id}>
                            <td>{u.nombre}</td>
                            <td>{u.email}</td>
                            <td>{u.rol}</td>
                            <td>
                                {/* Renderizado condicional: Solo el Gerente puede borrar */}
                                {user.rol === 'GERENTE_FLOTA' && (
                                    <button onClick={() => handleDelete(u.id)}>Eliminar</button>
                                )}
                                <button>Editar</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default UsuariosLista;