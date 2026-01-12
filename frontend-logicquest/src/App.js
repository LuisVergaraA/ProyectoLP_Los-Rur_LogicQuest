import React, { useState } from 'react';
import CrearEjercicio from './components/CrearEjercicio';
import VerHistorial from './components/VerHistorial';
import './App.css';

function App() {
  const [vistaActual, setVistaActual] = useState('crear');

  return (
    <div className="App">
      <header style={styles.header}>
        <h1 style={styles.headerTitle}>🎮 LogicQuest - Módulo de Ciclos</h1>
        <p style={styles.headerSubtitle}>Desarrollado por: Luis Roca</p>
      </header>

      <nav style={styles.nav}>
        <button
          onClick={() => setVistaActual('crear')}
          style={{
            ...styles.navButton,
            backgroundColor: vistaActual === 'crear' ? '#3498db' : '#95a5a6'
          }}
        >
          ➕ Crear Ejercicio
        </button>
        <button
          onClick={() => setVistaActual('historial')}
          style={{
            ...styles.navButton,
            backgroundColor: vistaActual === 'historial' ? '#3498db' : '#95a5a6'
          }}
        >
          📊 Ver Historial
        </button>
      </nav>

      <main>
        {vistaActual === 'crear' ? <CrearEjercicio /> : <VerHistorial />}
      </main>

      <footer style={styles.footer}>
        <p>© 2026 LogicQuest - Proyecto Lenguajes de Programación</p>
      </footer>
    </div>
  );
}

const styles = {
  header: {
    backgroundColor: '#2c3e50',
    color: 'white',
    padding: '30px',
    textAlign: 'center'
  },
  headerTitle: {
    margin: '0 0 10px 0',
    fontSize: '36px'
  },
  headerSubtitle: {
    margin: 0,
    fontSize: '16px',
    opacity: 0.8
  },
  nav: {
    display: 'flex',
    justifyContent: 'center',
    gap: '20px',
    padding: '20px',
    backgroundColor: '#ecf0f1'
  },
  navButton: {
    padding: '12px 24px',
    border: 'none',
    borderRadius: '5px',
    color: 'white',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'all 0.3s'
  },
  footer: {
    backgroundColor: '#34495e',
    color: 'white',
    textAlign: 'center',
    padding: '20px',
    marginTop: '40px'
  }
};

export default App;