import axios from 'axios';

const api = axios.create({
  baseURL: 'https://market-place-9qdu.onrender.com',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
