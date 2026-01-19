import { useEffect, useState } from 'react';
import { api } from '../services/api';

const Ranking = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      const data = await api.getLeaderboard();
      setLeaderboard(data.leaderboard || []);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const getMedalIcon = (rank) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return '🏅';
  };

  if (loading) {
    return (
      <div className="p-6 max-w-4xl mx-auto text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-yellow-600 border-r-transparent"></div>
        <p className="mt-2 text-gray-600">Cargando ranking...</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-yellow-700 flex items-center gap-2">
        <span>🏆</span>
        Tabla de Clasificación
      </h2>

      {leaderboard.length === 0 ? (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-8 text-center">
          <p className="text-yellow-800 text-lg">No hay datos de clasificación todavía.</p>
          <p className="text-yellow-600 mt-2">¡Sé el primero en completar ejercicios!</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
              <tr>
                <th className="px-6 py-3 text-left">Posición</th>
                <th className="px-6 py-3 text-left">Jugador</th>
                <th className="px-6 py-3 text-center">Puntos</th>
                <th className="px-6 py-3 text-center">Insignias</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {leaderboard.map((entry) => (
                <tr key={entry.user_id} className={`hover:bg-gray-50 ${
                  entry.rank <= 3 ? 'bg-yellow-50' : ''
                }`}>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{getMedalIcon(entry.rank)}</span>
                      <span className="font-bold text-lg">#{entry.rank}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-semibold text-gray-800">{entry.name}</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="inline-block px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full font-bold">
                      {entry.total_points}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="inline-block px-3 py-1 bg-purple-100 text-purple-700 rounded-full">
                      {entry.badges_count} 🏅
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Ranking;