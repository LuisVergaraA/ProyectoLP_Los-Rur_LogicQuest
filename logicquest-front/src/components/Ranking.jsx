// src/components/Ranking.jsx
import { useEffect, useState } from 'react';
import { api } from '../services/api';

const Ranking = () => {
  const [usuarios, setUsuarios] = useState([]);

  useEffect(() => {
    api.getLeaderboard().then(data => setUsuarios(data));
  }, []);

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-yellow-600">🏆 Tabla de Clasificación</h2>
      
      <div className="overflow-hidden rounded-lg shadow-lg">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="py-3 px-4 text-left">#</th>
              <th className="py-3 px-4 text-left">Estudiante</th>
              <th className="py-3 px-4 text-center">Insignias</th>
              <th className="py-3 px-4 text-right">Puntaje Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {usuarios.map((user, index) => (
              <tr key={user.user_id} className="hover:bg-gray-50">
                <td className="py-3 px-4 font-bold text-gray-500">{index + 1}</td>
                <td className="py-3 px-4 font-medium text-gray-900">{user.name}</td>
                <td className="py-3 px-4 text-center">
                  <span className="inline-block bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-bold">
                    🏅 {user.badges_count}
                  </span>
                </td>
                <td className="py-3 px-4 text-right font-bold text-indigo-600">
                  {user.total_points} pts
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Ranking;