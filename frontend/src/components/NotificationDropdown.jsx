import { useState, useEffect } from "react";
import { getAllNotifications, markAsRead } from "../api/notifications.api";

export function NotificationDropdown() {
    const [notifications, setNotifications] = useState([]);
    const [isOpen, setIsOpen] = useState(false);

    const unreadCount = notifications.filter(n => !n.is_read).length;

    useEffect(() => {
        const fetchNotifs = async () => {
            const res = await getAllNotifications();
            setNotifications(res.data);
        };
        fetchNotifs();
        // Polling: revisa cada 1 minuto (opcional para simular tiempo real)
        const interval = setInterval(fetchNotifs, 60000);
        return () => clearInterval(interval);
    }, []);

    const toggleRead = async (id) => {
        await markAsRead(id);
        setNotifications(notifications.map(n => n.id === id ? {...n, is_read: true} : n));
    };

    return (
        <div className="notification-container">
            <button className="notif-bell" onClick={() => setIsOpen(!isOpen)}>
                🔔 {unreadCount > 0 && <span className="badge">{unreadCount}</span>}
            </button>

            {isOpen && (
                <div className="notif-dropdown shadow-lg">
                    <div className="notif-header">Notificaciones</div>
                    <div className="notif-list">
                        {notifications.length > 0 ? (
                            notifications.map(n => (
                                <div key={n.id} className={`notif-item ${n.is_read ? 'read' : 'unread'}`}>
                                    <div className="notif-content">
                                        <span className={`type-tag ${n.notif_type.toLowerCase()}`}>
                                            {n.notif_type === 'MILEAGE' ? '📏 KM' : '📄 DOC'}
                                        </span>
                                        <p>{n.message}</p>
                                        <small>{new Date(n.created_at).toLocaleString()}</small>
                                    </div>
                                    {!n.is_read && (
                                        <button className="btn-mark-read" onClick={() => toggleRead(n.id)}>
                                            ✓
                                        </button>
                                    )}
                                </div>
                            ))
                        ) : (
                            <div className="notif-empty">Todo al día por aquí 🚚</div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}