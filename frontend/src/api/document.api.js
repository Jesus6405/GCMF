import axios from 'axios';

const API = axios.create({
    baseURL: 'http://localhost:8000/vehicles/api/v1/documents/',
});

export const getAllDocuments = () => API.get('/');
export const getDocument = (id_policy) => API.get(`/${id_policy}/`);
export const createDocument = (data) => API.post('/', data);
export const updateDocument = (id_policy, doc) => API.patch(`/${id_policy}/`, doc);
export const deleteDocument = (id_policy) => API.delete(`/${id_policy}/`);