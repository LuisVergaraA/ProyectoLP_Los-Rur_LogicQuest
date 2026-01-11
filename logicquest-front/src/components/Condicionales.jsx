// src/components/Condicionales.jsx
import { useEffect, useState } from 'react';
import { api } from '../services/api';

const Condicionales = () => {
  const [ejercicios, setEjercicios] = useState([]);
  
  // Estado para guardar qué respondió el usuario en cada ejercicio
  // Formato: { [id_ejercicio]: { indexSeleccionado: 0, esCorrecto: true } }
  const [resultados, setResultados] = useState({});

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      const data = await api.getCondicionales();
      setEjercicios(data);
    } catch (error) {
      console.error("Error conectando con el backend:", error);
    }
  };

  const manejarRespuesta = (ejercicioId, indexOpcion, indexCorrecto) => {
    // Evitar cambiar respuesta si ya respondió
    if (resultados[ejercicioId]) return;

    const esCorrecto = indexOpcion === indexCorrecto;
    
    setResultados(prev => ({
      ...prev,
      [ejercicioId]: {
        indexSeleccionado: indexOpcion,
        esCorrecto
      }
    }));
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-indigo-700">Módulo de Condicionales</h2>
      
      {ejercicios.length === 0 && <p>Cargando ejercicios...</p>}

      <div className="space-y-8">
        {ejercicios.map((ej) => {
          const resultado = resultados[ej.id];
          
          return (
            <div key={ej.id} className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
              <h3 className="text-xl font-semibold mb-4">{ej.statement}</h3>
              
              <div className="grid grid-cols-1 gap-3">
                {ej.options.map((opcion, index) => {
                  // Lógica de colores para los botones
                  let claseBtn = "p-3 text-left border rounded transition-colors hover:bg-gray-50";
                  
                  if (resultado) {
                    if (index === ej.correct_index) {
                      claseBtn = "p-3 text-left border rounded bg-green-100 border-green-500 font-bold"; // Correcta
                    } else if (index === resultado.indexSeleccionado && !resultado.esCorrecto) {
                      claseBtn = "p-3 text-left border rounded bg-red-100 border-red-500"; // Error del usuario
                    }
                  }

                  return (
                    <button
                      key={index}
                      onClick={() => manejarRespuesta(ej.id, index, ej.correct_index)}
                      className={claseBtn}
                      disabled={!!resultado}
                    >
                      {String.fromCharCode(65 + index)}. {opcion}
                    </button>
                  );
                })}
              </div>

              {/* Feedback Inmediato */}
              {resultado && (
                <div className={`mt-4 p-3 rounded ${resultado.esCorrecto ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                  {resultado.esCorrecto 
                    ? "¡Correcto! Has entendido la lógica." 
                    : "Incorrecto. Intenta repasar el concepto de if/else."}
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