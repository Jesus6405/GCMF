import axios from 'axios';

const api = axios.create({
    baseURL: 'http://127.0.0.1:8000/api/users/', 
});

// Interceptor para añadir el Access Token a cada petición
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Interceptor para manejar el Refresh Token cuando el Access expira
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const refreshToken = localStorage.getItem('refresh_token');
                const response = await axios.post('http://127.0.0.1:8000/api/users/token/refresh/', {
                    refresh: refreshToken,
                });
                localStorage.setItem('access_token', response.data.access);
                return api(originalRequest);
            } catch (err) {
                // Si el refresh también falla, mandamos al login
                localStorage.clear();
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

// 1. Obtener todos los usuarios (GET)
export const getUsuarios = () => api.get('gestion/');

// 2. Crear un usuario (POST) - Este reemplaza lo que tenías antes
export const createUsuario = (data) => api.post('gestion/', data);

// 3. Actualizar un usuario (PUT) - Recibe el ID y los nuevos datos
export const updateUsuario = (id, data) => api.put(`gestion/${id}/`, data);

// 4. Eliminar un usuario (DELETE)
export const deleteUsuario = (id) => api.delete(`gestion/${id}/`);

export default api;