import { useEffect, useState } from 'react';
import { api } from '../services/api';

const Perfil = () => {
  const [userData, setUserData] = useState(null);
  const [conditionalStats, setConditionalStats] = useState(null);
  const [cycleStats, setCycleStats] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const USER_ID = 1;

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      const condStats = await api.getConditionalHistory(USER_ID);
      setConditionalStats(condStats);

      const cycStats = await api.getCiclosHistory(USER_ID);
      setCycleStats(cycStats);

      const totalPoints = cycStats.statistics.total_points || 0;
      const totalExercises = (condStats.total_attempts || 0) + (cycStats.statistics.total_attempts || 0);
      const correctExercises = (condStats.correct_attempts || 0) + (cycStats.statistics.passed || 0);

      setUserData({
        id: USER_ID,
        name: "Estudiante Demo",
        totalPoints,
        totalExercises,
        correctExercises,
        level: Math.floor(totalPoints / 50) + 1
      });

    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const getBadges = () => {
    const badges = [];
    
    if (!userData) return badges;

    if (conditionalStats && conditionalStats.correct_attempts >= 5) {
      badges.push({
        name: "Maestro Condicional",
        description: "Completó 5 ejercicios de condicionales",
        icon: "🎯",
        color: "bg-blue-100 text-blue-800"
      });
    }

    if (conditionalStats && conditionalStats.correct_attempts >= 10) {
      badges.push({
        name: "Experto en If/Else",
        description: "Completó 10 ejercicios de condicionales",
        icon: "⭐",
        color: "bg-yellow-100 text-yellow-800"
      });
    }

    if (cycleStats && cycleStats.statistics.passed >= 3) {
      badges.push({
        name: "Domina los Bucles",
        description: "Completó 3 ejercicios de ciclos",
        icon: "🔄",
        color: "bg-purple-100 text-purple-800"
      });
    }

    if (userData.totalPoints >= 100) {
      badges.push({
        name: "Acumulador de Puntos",
        description: "Alcanzó 100 puntos totales",
        icon: "💎",
        color: "bg-green-100 text-green-800"
      });
    }

    if (userData.correctExercises >= 15) {
      badges.push({
        name: "Lógica Suprema",
        description: "Completó 15 ejercicios correctamente",
        icon: "👑",
        color: "bg-red-100 text-red-800"
      });
    }

    return badges;
  };

  if (loading) {
    return (
      <div className="p-6 max-w-4xl mx-auto text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-indigo-600 border-r-transparent"></div>
        <p className="mt-2 text-gray-600">Cargando perfil...</p>
      </div>
    );
  }

  const badges = getBadges();

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-indigo-700">Mi Perfil</h2>

      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg shadow-lg p-6 text-white mb-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-3xl">
                👤
              </div>
              <div>
                <h3 className="text-2xl font-bold">{userData?.name}</h3>
                <p className="text-indigo-100">Nivel {userData?.level}</p>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-4xl font-bold">{userData?.totalPoints}</div>
            <div className="text-indigo-100">Puntos Totales</div>
          </div>
        </div>

        <div className="mt-4">
          <div className="flex justify-between text-sm mb-1">
            <span>Progreso al Nivel {userData?.level + 1}</span>
            <span>{userData?.totalPoints % 50}/50</span>
          </div>
          <div className="w-full bg-indigo-300 rounded-full h-3">
            <div 
              className="bg-white h-3 rounded-full transition-all duration-500"
              style={{ width: `${((userData?.totalPoints % 50) / 50) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <div className="text-3xl font-bold text-indigo-600">{userData?.totalExercises}</div>
          <div className="text-gray-600">Ejercicios Intentados</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <div className="text-3xl font-bold text-green-600">{userData?.correctExercises}</div>
          <div className="text-gray-600">Ejercicios Correctos</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <div className="text-3xl font-bold text-purple-600">
            {userData?.totalExercises > 0 
              ? Math.round((userData?.correctExercises / userData?.totalExercises) * 100) 
              : 0}%
          </div>
          <div className="text-gray-600">Tasa de Éxito</div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
        <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <span>🏅</span>
          Mis Insignias
          <span className="text-sm font-normal text-gray-500">({badges.length} obtenidas)</span>
        </h3>

        {badges.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <div className="text-6xl mb-3">🎯</div>
            <p>Aún no has desbloqueado ninguna insignia.</p>
            <p className="text-sm mt-2">¡Sigue practicando para obtener logros!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {badges.map((badge, index) => (
              <div 
                key={index} 
                className={`${badge.color} p-4 rounded-lg border-2 border-current transform hover:scale-105 transition-transform`}
              >
                <div className="text-4xl mb-2 text-center">{badge.icon}</div>
                <h4 className="font-bold text-center mb-1">{badge.name}</h4>
                <p className="text-xs text-center opacity-80">{badge.description}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <h4 className="text-lg font-bold mb-3 text-indigo-600">📝 Condicionales</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Intentos totales:</span>
              <span className="font-semibold">{conditionalStats?.total_attempts || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Correctos:</span>
              <span className="font-semibold text-green-600">{conditionalStats?.correct_attempts || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Tasa de éxito:</span>
              <span className="font-semibold">{conditionalStats?.success_rate || 0}%</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <h4 className="text-lg font-bold mb-3 text-purple-600">🔄 Ciclos</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Intentos totales:</span>
              <span className="font-semibold">{cycleStats?.statistics.total_attempts || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Aprobados:</span>
              <span className="font-semibold text-green-600">{cycleStats?.statistics.passed || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Tasa de éxito:</span>
              <span className="font-semibold">{cycleStats?.statistics.success_rate || 0}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Puntos ganados:</span>
              <span className="font-semibold text-indigo-600">{cycleStats?.statistics.total_points || 0}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Perfil;