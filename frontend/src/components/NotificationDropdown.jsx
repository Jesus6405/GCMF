import { useState, useEffect, useRef } from "react";
import { getAllNotifications, markAsRead } from "../api/notifications.api";

export function NotificationDropdown() {
    const [notifications, setNotifications] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const unreadCount = notifications.filter(n => !n.is_read).length;

    // Cerrar al hacer click fuera
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        const fetchNotifs = async () => {
            try {
                const res = await getAllNotifications();
                setNotifications(res.data);
            } catch (error) { console.error("Error cargando notificaciones", error); }
        };
        fetchNotifs();
        const interval = setInterval(fetchNotifs, 30000); // Actualiza cada 30 seg
        return () => clearInterval(interval);
    }, []);

    const toggleRead = async (id) => {
        await markAsRead(id);
        setNotifications(notifications.map(n => n.id === id ? {...n, is_read: true} : n));
    };

    return (
        <div className="notification-container" ref={dropdownRef}>
            <button className="notif-bell" onClick={() => setIsOpen(!isOpen)}>
                🔔 {unreadCount > 0 && <span className="badge">{unreadCount}</span>}
            </button>

            {isOpen && (
                <div className="notif-dropdown shadow-lg">
                    <div className="notif-header">Centro de Alertas</div>
                    <div className="notif-list">
                        {notifications.length > 0 ? (
                            notifications.map(n => (
                                <div key={n.id} className={`notif-item ${n.is_read ? 'read' : 'unread'}`}>
                                    <div className="notif-content">
                                        <span className={`type-tag ${n.notif_type?.toLowerCase()}`}>
                                            {n.notif_type === 'MILEAGE' ? '📏 KM' : '📄 DOC'}
                                        </span>
                                        <p>{n.message}</p>
                                        <small>{new Date(n.created_at).toLocaleString()}</small>
                                    </div>
                                    {!n.is_read && (
                                        <button className="btn-mark-read" onClick={() => toggleRead(n.id)}>✓</button>
                                    )}
                                </div>
                            ))
                        ) : (
                            <div className="notif-empty">No hay alertas pendientes 🚚</div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}