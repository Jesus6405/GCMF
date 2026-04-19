import axios from 'axios';

const API = axios.create({
    baseURL: 'http://localhost:8000/vehicles/api/v1/incidents/',
});

export const getAllIncidents = () => API.get('/');
export const getIncident = (id) => API.get(`/${id}/`);
export const createIncident = (data) => API.post('/', data);
export const updateIncident = (id, data) => API.put(`/${id}/`, data);
export const deleteIncident = (id) => API.delete(`/${id}/`);