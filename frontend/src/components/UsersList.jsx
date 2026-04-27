import { useEffect, useState, useContext } from 'react';
import { getUsers, deleteUser } from '../api/users.api';
import AuthContext from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { UserCard } from './UserCard';

export const UsersList = () => {
    const [users, setUsers] = useState([]);
    const { user } = useContext(AuthContext); // Para saber quién es el que está mirando

    const loadUsers = async () => {
        try {
            const res = await getUsers();
            setUsers(res.data);
        } catch (error) {
            console.error("Error cargando usuarios", error);
        }
    };

    useEffect(() => {
        loadUsers();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm("¿Estás seguro de eliminar este usuario?")) {
            await deleteUser(id);
            loadUsers(); // Recargamos la lista después de borrar
        }
    };

    return (
        <div className="page-container">
            <div className="page-header">
                <h2>Gestión de personal</h2>
                <p>Lista usuarios registrados en el sistema</p>
            </div>
            
            <div className="table-container">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nombre</th>
                            <th>Email</th>
                            <th>Rol</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((listUser) => (
                            <UserCard 
                                key={listUser.id} 
                                listUser={listUser} 
                                onDelete={handleDelete} 
                            />
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UsersList;

