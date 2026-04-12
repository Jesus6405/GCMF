import axios from "axios";

const API_URL = "http://localhost:8000/vehicles/api/v1/vehicles/";

export const getAllVehicles = () => {
    return axios.get(API_URL);
} 