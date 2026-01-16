// src/App.jsx
import { useState } from 'react';
import Condicionales from './components/Condicionales';
import Ciclos from './components/Ciclos'; // <--- Importar
import Ranking from './components/Ranking';

function App() {
  const [vista, setVista] = useState('ejercicios'); // 'ejercicios' ahora será 'condicionales' para ser más claro, o mantenlo así.

  // Helper para clases de botones
  const btnClass = (active) => 
    `px-4 py-2 rounded-md transition-colors ${active ? 'bg-indigo-600 text-white shadow' : 'text-gray-600 hover:bg-gray-100'}`;

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800 font-sans">
      <nav className="bg-white shadow-sm p-4 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold tracking-tight text-indigo-600">LogicQuest</h1>
          <div className="space-x-2 flex">
            <button 
              onClick={() => setVista('condicionales')}
              className={btnClass(vista === 'condicionales' || vista === 'ejercicios')}
            >
              Condicionales
            </button>
            <button 
              onClick={() => setVista('ciclos')}
              className={btnClass(vista === 'ciclos')}
            >
              Ciclos
            </button>
            <button 
              onClick={() => setVista('ranking')}
              className={btnClass(vista === 'ranking')}
            >
              Ranking
            </button>
          </div>
        </div>
      </nav>

      <main className="mt-8 mb-12">
        {(vista === 'ejercicios' || vista === 'condicionales') && <Condicionales />}
        {vista === 'ciclos' && <Ciclos />}
        {vista === 'ranking' && <Ranking />}
      </main>
    </div>
  );
}

export default App;