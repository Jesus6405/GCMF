import { useEffect, useState } from "react";
import { getAllNotifications, markAsRead } from "../api/notifications.api";

export function NotificationsPage() {
    const [notifications, setNotifications] = useState([]);

    const loadNotifications = async () => {
        const res = await getAllNotifications();
        setNotifications(res.data);
    };

    useEffect(() => { loadNotifications(); }, []);

    const handleMarkAsRead = async (id) => {
        await markAsRead(id);
        loadNotifications(); // Recargamos para actualizar el estilo de "leída"
    };

    return (
        <div className="page-container">
            <header className="page-header">
                <h2>Centro de Alertas y Notificaciones</h2>
                <p>Gestión de alertas de kilometraje y avisos del sistema.</p>
            </header>

            <div className="table-container">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Tipo</th>
                            <th>Mensaje</th>
                            <th>Fecha</th>
                            <th>Estado</th>
                            <th>Acción</th>
                        </tr>
                    </thead>
                    <tbody>
                        {notifications.length > 0 ? (
                            notifications.map((n) => (
                                <tr key={n.id} className={`table-row ${n.is_read ? 'read-notif' : 'unread-notif'}`}>
                                    <td>
                                        <span className={`status-badge ${n.notif_type === 'MILEAGE' ? 'bg-blue' : ''}`}>
                                            {n.notif_type === 'MILEAGE' ? '📏 KM' : '📄 SISTEMA'}
                                        </span>
                                    </td>
                                    <td className={!n.is_read ? "font-bold" : ""}>{n.message}</td>
                                    <td>{new Date(n.created_at).toLocaleString()}</td>
                                    <td>{n.is_read ? "Leída" : "Pendiente"}</td>
                                    <td>
                                        {!n.is_read && (
                                            <button className="btn btn-edit" onClick={() => handleMarkAsRead(n.id)}>
                                                Marcar como leída
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr><td colSpan="5" style={{ textAlign: 'center', padding: '40px' }}>No hay notificaciones.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}