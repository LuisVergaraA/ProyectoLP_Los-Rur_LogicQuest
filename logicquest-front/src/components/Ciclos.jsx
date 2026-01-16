// src/components/Ciclos.jsx
import { useEffect, useState } from 'react';
import { api } from '../services/api';

const Ciclos = () => {
  const [ciclos, setCiclos] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Estado para guardar las respuestas del usuario
  // Estructura: { [cycleId]: ["respuesta_case_1", "respuesta_case_2"] }
  const [inputs, setInputs] = useState({});
  
  // Estado para el feedback tras validar
  const [feedback, setFeedback] = useState({});

  // ID temporal para probar (asegúrate de que el usuario ID 1 exista en tu DB)
  const USER_ID_TEMPORAL = 1;

  useEffect(() => {
    cargarCiclos();
  }, []);

  const cargarCiclos = async () => {
    try {
      const data = await api.getCiclos();
      setCiclos(data);
    } catch (error) {
      console.error("Error cargando ciclos:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (cycleId, caseIndex, value) => {
    setInputs(prev => {
      const cycleInputs = prev[cycleId] ? [...prev[cycleId]] : [];
      cycleInputs[caseIndex] = value;
      return { ...prev, [cycleId]: cycleInputs };
    });
  };

  const validarRespuesta = async (cycle) => {
    const respuestasUsuario = inputs[cycle.id] || [];
    
    // Validar que haya respondido todo
    if (respuestasUsuario.length < cycle.test_cases.length) {
      alert("Por favor completa todos los casos de prueba antes de validar.");
      return;
    }

    try {
      const resultado = await api.submitCiclo(cycle.id, USER_ID_TEMPORAL, respuestasUsuario);
      
      setFeedback(prev => ({
        ...prev,
        [cycle.id]: {
          esCorrecto: resultado.data.is_correct,
          mensaje: resultado.message,
          puntos: resultado.data.points_earned
        }
      }));

    } catch (error) {
      console.error("Error validando:", error);
      alert("Ocurrió un error al validar la respuesta.");
    }
  };

  if (loading) return <div className="p-6">Cargando retos de ciclos...</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-indigo-700">Módulo de Ciclos (Bucles)</h2>
      
      <div className="space-y-8">
        {ciclos.map((ciclo) => {
          const estadoFeedback = feedback[ciclo.id];
          const esFor = ciclo.loop_type === 'for';

          return (
            <div key={ciclo.id} className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
              {/* Encabezado del Ejercicio */}
              <div className="flex justify-between items-start mb-4">
                <div>
                  <span className={`text-xs font-bold px-2 py-1 rounded uppercase ${esFor ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'}`}>
                    Bucle {ciclo.loop_type}
                  </span>
                  <span className="ml-2 text-xs font-bold px-2 py-1 rounded bg-gray-100 text-gray-600 uppercase">
                    {ciclo.difficulty}
                  </span>
                  <h3 className="text-xl font-bold mt-2">{ciclo.title}</h3>
                </div>
                <div className="text-sm font-semibold text-green-600">
                  +{ciclo.points} pts
                </div>
              </div>

              <p className="text-gray-600 mb-6">{ciclo.description}</p>

              {/* Casos de Prueba (Inputs) */}
              <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
                <h4 className="font-semibold text-sm text-gray-700 mb-3">Casos de prueba:</h4>
                {ciclo.test_cases.map((test, index) => (
                  <div key={index} className="flex items-center gap-4 mb-3 last:mb-0">
                    <div className="flex-1 font-mono text-sm bg-white border px-3 py-2 rounded text-gray-600">
                      Entrada: {test.input}
                    </div>
                    <div className="flex-1">
                      <input 
                        type="text"
                        placeholder="Tu salida esperada..."
                        className="w-full font-mono text-sm border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-indigo-500"
                        onChange={(e) => handleInputChange(ciclo.id, index, e.target.value)}
                        disabled={estadoFeedback?.esCorrecto}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Botón de Acción y Feedback */}
              <div className="mt-4 flex items-center justify-between">
                <button
                  onClick={() => validarRespuesta(ciclo)}
                  disabled={estadoFeedback?.esCorrecto}
                  className={`px-6 py-2 rounded font-semibold text-white transition-colors ${
                    estadoFeedback?.esCorrecto 
                      ? 'bg-green-500 cursor-default' 
                      : 'bg-indigo-600 hover:bg-indigo-700'
                  }`}
                >
                  {estadoFeedback?.esCorrecto ? '¡Completado!' : 'Validar Respuesta'}
                </button>

                {estadoFeedback && (
                  <div className={`px-4 py-2 rounded text-sm font-bold ${
                    estadoFeedback.esCorrecto ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {estadoFeedback.mensaje} {estadoFeedback.esCorrecto && `(+${estadoFeedback.puntos} pts)`}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Ciclos;