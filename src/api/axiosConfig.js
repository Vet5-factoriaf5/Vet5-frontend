// src/api/axiosConfig.js
import axios from 'axios';

const BASE_URL = 'http://localhost:8080/api/v1';

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // Para enviar cookies (JSESSIONID)
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;