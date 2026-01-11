// src/services/api.js
import axios from 'axios';

// Tu backend corre en el puerto 8000 por defecto
const API_URL = 'http://127.0.0.1:8000/api/v1';

export const api = {
  // Obtiene los ejercicios del endpoint definido en routers/condicionales.py
  getCondicionales: async () => {
    const response = await axios.get(`${API_URL}/condicionales`);
    return response.data; 
  },

  // Obtiene el ranking del endpoint definido en routers/gamificacion.py
  getLeaderboard: async () => {
    const response = await axios.get(`${API_URL}/gamificacion/leaderboard`);
    return response.data;
  }
};