import axios from "axios";

const API = axios.create({
    baseURL: 'http://localhost:8000/vehicles/api/v1/vehicles/'
});

export const getAllVehicles = () => API.get('/');
export const getVehicle = (placa) => API.get(`/${placa}/`);
export const createVehicle = (vehicleData) => API.post('/', vehicleData);
export const updateVehicle = (placa, vehicle) => API.put(`/${placa}/`, vehicle);
export const deleteVehicle = (placa) => API.delete(`/${placa}/`);
