import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api/v1';

export const api = {
  // --- CONDICIONALES ---
  getCondicionales: async () => {
    const response = await axios.get(`${API_URL}/condicionales`);
    return response.data; 
  },

  // --- GAMIFICACIÓN ---
  getLeaderboard: async () => {
    const response = await axios.get(`${API_URL}/gamificacion/leaderboard`);
    return response.data;
  },

  // --- CICLOS (NUEVO) ---
  getCiclos: async () => {
    const response = await axios.get(`${API_URL}/ciclos`);
    return response.data;
  },

  submitCiclo: async (cycleId, userId, answersArray) => {
    // El backend espera: { user_id: int, user_answer: { outputs: [] } }
    const payload = {
      user_id: userId,
      user_answer: {
        outputs: answersArray
      }
    };
    const response = await axios.post(`${API_URL}/ciclos/${cycleId}/intentar`, payload);
    return response.data;
  }
};