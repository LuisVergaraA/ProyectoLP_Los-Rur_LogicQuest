import { useState } from 'react';
import Condicionales from './components/Condicionales';
import Ranking from './components/Ranking';

function App() {
  const [vista, setVista] = useState('ejercicios');

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800 font-sans">
      <nav className="bg-white shadow-sm p-4 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold tracking-tight text-indigo-600">LogicQuest</h1>
          <div className="space-x-2">
            <button 
              onClick={() => setVista('ejercicios')}
              className={`px-4 py-2 rounded-md ${vista === 'ejercicios' ? 'bg-indigo-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              Condicionales
            </button>
            <button 
              onClick={() => setVista('ranking')}
              className={`px-4 py-2 rounded-md ${vista === 'ranking' ? 'bg-indigo-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              Ranking
            </button>
          </div>
        </div>
      </nav>

      <main className="mt-8">
        {vista === 'ejercicios' ? <Condicionales /> : <Ranking />}
      </main>
    </div>
  );
}

export default App;