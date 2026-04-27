import axios from 'axios';

const api = axios.create({ 
    baseURL: 'http://localhost:8000/vehicles/api/v1/maintenanceOrders/' // Usamos la base de la API
});

// Obtener todas (usa el MaintenanceOrderViewSet unificado)
export const getAllMaintenanceOrders = () => api.get('');

// Crear específicas según el tipo
export const createMaintenanceOrder = (data) => api.post('/', data);

// Otras operaciones (usando el ID unificado)
export const getMaintenanceOrder = (id) => api.get(`/${id}/`);
export const updateMaintenanceOrder = (id, data) => api.put(`/${id}/`, data);
export const deleteMaintenanceOrder = (id) => api.delete(`/${id}/`);