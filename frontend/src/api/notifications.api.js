import axios from 'axios';

const api = axios.create({ 
    baseURL: 'http://localhost:8000/vehicles/api/v1/notifications/' 
});

export const getAllNotifications = () => api.get('');

// Marcar como leída usando actualización parcial (PATCH)
export const markAsRead = (id) => api.patch(`${id}/`, { is_read: true });