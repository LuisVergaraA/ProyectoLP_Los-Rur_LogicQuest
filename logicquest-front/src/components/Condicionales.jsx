import { useEffect, useState } from 'react';
import { api } from '../services/api';

const Condicionales = () => {
  const [ejercicios, setEjercicios] = useState([]);
  const [resultados, setResultados] = useState({});
  const [loading, setLoading] = useState(true);
  
  const USER_ID = 1;

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      const data = await api.getCondicionales();
      setEjercicios(data);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const manejarRespuesta = async (ejercicioId, indexOpcion) => {
    if (resultados[ejercicioId]) return;

    try {
      const resultado = await api.submitConditional(ejercicioId, USER_ID, indexOpcion);
      
      setResultados(prev => ({
        ...prev,
        [ejercicioId]: {
          indexSeleccionado: indexOpcion,
          esCorrecto: resultado.is_correct,
          correctIndex: resultado.correct_index,
          mensaje: resultado.message
        }
      }));
    } catch (error) {
      console.error("Error al validar:", error);
      alert("Error al validar la respuesta");
    }
  };

  if (loading) {
    return (
      <div className="p-6 max-w-3xl mx-auto text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-indigo-600 border-r-transparent"></div>
        <p className="mt-2 text-gray-600">Cargando ejercicios...</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-indigo-700">Módulo de Condicionales</h2>
      
      {ejercicios.length === 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-800">No hay ejercicios disponibles.</p>
        </div>
      )}

      <div className="space-y-8">
        {ejercicios.map((ej) => {
          const resultado = resultados[ej.id];
          
          return (
            <div key={ej.id} className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-semibold flex-1 whitespace-pre-wrap">{ej.statement}</h3>
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
              
              <div className="grid grid-cols-1 gap-3">
                {ej.options.map((opcion, index) => {
                  let claseBtn = "p-3 text-left border rounded transition-colors cursor-pointer";
                  let disabled = false;
                  
                  if (resultado) {
                    disabled = true;
                    if (index === resultado.correctIndex) {
                      claseBtn += " bg-green-100 border-green-500 font-bold";
                    } else if (index === resultado.indexSeleccionado && !resultado.esCorrecto) {
                      claseBtn += " bg-red-100 border-red-500";
                    } else {
                      claseBtn += " bg-gray-50 border-gray-200";
                    }
                  } else {
                    claseBtn += " hover:bg-indigo-50 hover:border-indigo-300";
                  }

                  return (
                    <button
                      key={index}
                      onClick={() => manejarRespuesta(ej.id, index)}
                      className={claseBtn}
                      disabled={disabled}
                    >
                      <span className="font-bold mr-2">{String.fromCharCode(65 + index)}.</span>
                      {opcion}
                    </button>
                  );
                })}
              </div>

              {resultado && (
                <div className={`mt-4 p-4 rounded-lg ${
                  resultado.esCorrecto 
                    ? 'bg-green-50 border border-green-200' 
                    : 'bg-red-50 border border-red-200'
                }`}>
                  <p className={`font-medium ${
                    resultado.esCorrecto ? 'text-green-800' : 'text-red-800'
                  }`}>
                    {resultado.mensaje}
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

export default Condicionales;