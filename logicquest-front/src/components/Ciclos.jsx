import { useEffect, useState } from 'react';
import { api } from '../services/api';

const Ciclos = () => {
  const [ciclos, setCiclos] = useState([]);
  const [respuestas, setRespuestas] = useState({});
  const [resultados, setResultados] = useState({});
  const [loading, setLoading] = useState(true);
  
  const USER_ID = 1;

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      const data = await api.getCiclos();
      setCiclos(data);
      
      const respuestasIniciales = {};
      data.forEach(ciclo => {
        respuestasIniciales[ciclo.id] = Array(ciclo.test_cases.length).fill('');
      });
      setRespuestas(respuestasIniciales);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const manejarCambio = (cicloId, index, valor) => {
    setRespuestas(prev => ({
      ...prev,
      [cicloId]: prev[cicloId].map((r, i) => i === index ? valor : r)
    }));
  };

  const validar = async (cicloId) => {
    if (resultados[cicloId]) return;

    try {
      const resultado = await api.submitCiclo(cicloId, USER_ID, respuestas[cicloId]);
      
      setResultados(prev => ({
        ...prev,
        [cicloId]: {
          esCorrecto: resultado.is_correct,
          mensaje: resultado.message,
          puntos: resultado.points_earned
        }
      }));
    } catch (error) {
      console.error("Error al validar:", error);
      alert("Error al validar la respuesta");
    }
  };

  if (loading) {
    return (
      <div className="p-6 max-w-4xl mx-auto text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-purple-600 border-r-transparent"></div>
        <p className="mt-2 text-gray-600">Cargando retos...</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-purple-700">Módulo de Ciclos</h2>
      
      {ciclos.length === 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-800">No hay retos disponibles.</p>
        </div>
      )}

      <div className="space-y-8">
        {ciclos.map((ciclo) => {
          const resultado = resultados[ciclo.id];
          
          return (
            <div key={ciclo.id} className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-purple-700">{ciclo.title}</h3>
                  <p className="text-gray-600 mt-1">{ciclo.description}</p>
                  <div className="flex gap-2 mt-2">
                    <span className="text-xs px-2 py-1 bg-purple-100 text-purple-700 rounded">
                      {ciclo.loop_type}
                    </span>
                    <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded">
                      {ciclo.difficulty}
                    </span>
                    <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-700 rounded">
                      {ciclo.points} pts
                    </span>
                  </div>
                </div>
                {resultado && (
                  <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                    resultado.esCorrecto 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {resultado.esCorrecto ? '✓ Correcto' : '✗ Incorrecto'}
                  </span>
                )}
              </div>

              <div className="mt-4">
                <h4 className="font-semibold mb-2">Casos de Prueba:</h4>
                <div className="space-y-2">
                  {ciclo.test_cases.map((tc, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded">
                      <span className="text-sm font-medium w-20">Entrada {tc.input}:</span>
                      <span className="text-sm text-gray-600">Salida esperada →</span>
                      <input
                        type="text"
                        value={respuestas[ciclo.id]?.[index] || ''}
                        onChange={(e) => manejarCambio(ciclo.id, index, e.target.value)}
                        disabled={!!resultado}
                        className="px-3 py-1 border rounded flex-1"
                        placeholder="Tu respuesta"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {!resultado ? (
                <button
                  onClick={() => validar(ciclo.id)}
                  className="mt-4 px-6 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors"
                >
                  Validar Respuesta
                </button>
              ) : (
                <div className={`mt-4 p-4 rounded-lg ${
                  resultado.esCorrecto 
                    ? 'bg-green-50 border border-green-200' 
                    : 'bg-red-50 border border-red-200'
                }`}>
                  <p className={`font-medium ${
                    resultado.esCorrecto ? 'text-green-800' : 'text-red-800'
                  }`}>
                    {resultado.mensaje}
                    {resultado.esCorrecto && ` +${resultado.puntos} puntos`}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Ciclos;