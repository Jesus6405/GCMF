import axios from "axios";

const API = axios.create({
   // CORRECTO (asumiendo que en tu urls.py principal usas 'vehicles/')
    baseURL: 'http://localhost:8000/vehicles/api/v1/odometer/'
});

export const getAllOdometerLogs = () => API.get('/');
export const getOdometerLog = (id) => API.get(`/${id}/`);
export const createOdometerLog = (logData) => API.post('/', logData);
export const updateOdometerLog = (id, log) => API.put(`/${id}/`, log);
export const deleteOdometerLog = (id) => API.delete(`/${id}/`);
