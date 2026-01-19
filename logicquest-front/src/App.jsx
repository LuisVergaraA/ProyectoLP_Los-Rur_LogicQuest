import { useState } from 'react';
import Condicionales from './components/Condicionales';
import Ciclos from './components/Ciclos';
import Ranking from './components/Ranking';
import Perfil from './components/Perfil';

function App() {
  const [vista, setVista] = useState('condicionales');

  const btnClass = (active) => 
    `px-4 py-2 rounded-md transition-colors font-medium ${
      active 
        ? 'bg-indigo-600 text-white shadow-md' 
        : 'text-gray-600 hover:bg-gray-100'
    }`;

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800">
      <nav className="bg-white shadow-sm p-4 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-indigo-600 flex items-center gap-2">
            <span className="text-3xl">🎮</span>
            LogicQuest
          </h1>
          
          <div className="flex gap-2">
            <button 
              onClick={() => setVista('condicionales')}
              className={btnClass(vista === 'condicionales')}
            >
              📝 Condicionales
            </button>
            <button 
              onClick={() => setVista('ciclos')}
              className={btnClass(vista === 'ciclos')}
            >
              🔄 Ciclos
            </button>
            <button 
              onClick={() => setVista('ranking')}
              className={btnClass(vista === 'ranking')}
            >
              🏆 Ranking
            </button>
            <button 
              onClick={() => setVista('perfil')}
              className={btnClass(vista === 'perfil')}
            >
              👤 Mi Perfil
            </button>
          </div>
        </div>
      </nav>

      <main className="mt-8 mb-12">
        {vista === 'condicionales' && <Condicionales />}
        {vista === 'ciclos' && <Ciclos />}
        {vista === 'ranking' && <Ranking />}
        {vista === 'perfil' && <Perfil />}
      </main>

      <footer className="bg-white border-t border-gray-200 py-6 mt-12">
        <div className="max-w-6xl mx-auto px-4 text-center text-gray-600 text-sm">
          <p>LogicQuest - Plataforma Gamificada de Aprendizaje de Lógica de Programación</p>
          <p className="mt-1">Desarrollado por: Johao Dorado, Luis Roca, Luis Vergara</p>
        </div>
      </footer>
    </div>
  );
}

export default App;