import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/vehicles';

export const getDashboardStats = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/dashboard/stats/`);
    return response.data;
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    throw error;
  }
};