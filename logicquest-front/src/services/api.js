import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api/v1';

export const api = {
  // CONDICIONALES
  getCondicionales: async () => {
    const response = await axios.get(`${API_URL}/condicionales`);
    return response.data;
  },

  submitConditional: async (exerciseId, userId, selectedIndex) => {
    const payload = {
      user_id: userId,
      selected_index: selectedIndex
    };
    const response = await axios.post(`${API_URL}/condicionales/${exerciseId}/intentar`, payload);
    return response.data;
  },

  getConditionalHistory: async (userId) => {
    const response = await axios.get(`${API_URL}/condicionales/historial/${userId}`);
    return response.data;
  },

  // CICLOS
  getCiclos: async () => {
    const response = await axios.get(`${API_URL}/ciclos`);
    return response.data;
  },

  submitCiclo: async (cycleId, userId, answersArray) => {
    const payload = {
      user_id: userId,
      user_answer: {
        outputs: answersArray
      }
    };
    const response = await axios.post(`${API_URL}/ciclos/${cycleId}/intentar`, payload);
    return response.data;
  },

  getCiclosHistory: async (userId) => {
    const response = await axios.get(`${API_URL}/ciclos/historial`, {
      params: { user_id: userId }
    });
    return response.data;
  },

  // GAMIFICACIÓN
  getLeaderboard: async () => {
    const response = await axios.get(`${API_URL}/gamificacion/leaderboard`);
    return response.data;
  },

  createUser: async (name) => {
    const response = await axios.post(`${API_URL}/users`, { name });
    return response.data;
  }
};