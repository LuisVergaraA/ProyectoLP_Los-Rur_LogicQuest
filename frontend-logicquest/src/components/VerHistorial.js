import React, { useState } from 'react';
import axios from 'axios';

function VerHistorial() {
  const [userId, setUserId] = useState('1');
  const [historial, setHistorial] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const obtenerHistorial = async () => {
    setLoading(true);
    setError('');
    
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/api/v1/ciclos/historial?user_id=${userId}`,
        {
          headers: {
            'Accept': 'application/json'
          }
        }
      );

      if (response.data.success) {
        setHistorial(response.data.data);
      }
    } catch (err) {
      setError('❌ Error al obtener el historial: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>📊 Historial de Progreso</h2>

      <div style={styles.searchBox}>
        <label style={styles.label}>ID del Usuario:</label>
        <div style={styles.searchRow}>
          <input
            type="number"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            style={styles.input}
            placeholder="Ingrese ID del usuario"
          />
          <button onClick={obtenerHistorial} style={styles.button} disabled={loading}>
            {loading ? 'Cargando...' : 'Ver Historial'}
          </button>
        </div>
      </div>

      {error && <div style={styles.error}>{error}</div>}

      {historial && (
        <div style={styles.results}>
          <div style={styles.statsGrid}>
            <div style={styles.statCard}>
              <div style={styles.statNumber}>{historial.statistics.total_attempts}</div>
              <div style={styles.statLabel}>Total Intentos</div>
            </div>
            <div style={{...styles.statCard, backgroundColor: '#2ecc71'}}>
              <div style={styles.statNumber}>{historial.statistics.passed}</div>
              <div style={styles.statLabel}>Aprobados</div>
            </div>
            <div style={{...styles.statCard, backgroundColor: '#e74c3c'}}>
              <div style={styles.statNumber}>{historial.statistics.failed}</div>
              <div style={styles.statLabel}>Fallidos</div>
            </div>
            <div style={{...styles.statCard, backgroundColor: '#f39c12'}}>
              <div style={styles.statNumber}>{historial.statistics.success_rate}%</div>
              <div style={styles.statLabel}>Tasa de Éxito</div>
            </div>
            <div style={{...styles.statCard, backgroundColor: '#9b59b6'}}>
              <div style={styles.statNumber}>{historial.statistics.total_points}</div>
              <div style={styles.statLabel}>Puntos Totales</div>
            </div>
            <div style={{...styles.statCard, backgroundColor: '#1abc9c'}}>
              <div style={styles.statNumber}>{historial.statistics.average_time_ms}ms</div>
              <div style={styles.statLabel}>Tiempo Promedio</div>
            </div>
          </div>

          <h3 style={styles.subtitle}>Progreso por Tipo de Bucle:</h3>
          
          <div style={styles.progressGrid}>
            <div style={styles.progressCard}>
              <h4 style={styles.progressTitle}>🔁 Bucles FOR</h4>
              <div style={styles.progressInfo}>
                <p><strong>Total de Ejercicios:</strong> {historial.progress_by_type.for.total_cycles}</p>
                <p><strong>Completados:</strong> {historial.progress_by_type.for.completed_cycles}</p>
                <p><strong>Tasa de Completitud:</strong> {historial.progress_by_type.for.completion_rate}%</p>
                <div style={styles.progressBar}>
                  <div 
                    style={{
                      ...styles.progressFill,
                      width: `${historial.progress_by_type.for.completion_rate}%`,
                      backgroundColor: '#3498db'
                    }}
                  />
                </div>
              </div>
            </div>

            <div style={styles.progressCard}>
              <h4 style={styles.progressTitle}>⭕ Bucles WHILE</h4>
              <div style={styles.progressInfo}>
                <p><strong>Total de Ejercicios:</strong> {historial.progress_by_type.while.total_cycles}</p>
                <p><strong>Completados:</strong> {historial.progress_by_type.while.completed_cycles}</p>
                <p><strong>Tasa de Completitud:</strong> {historial.progress_by_type.while.completion_rate}%</p>
                <div style={styles.progressBar}>
                  <div 
                    style={{
                      ...styles.progressFill,
                      width: `${historial.progress_by_type.while.completion_rate}%`,
                      backgroundColor: '#9b59b6'
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {historial.recent_attempts.length > 0 && (
            <>
              <h3 style={styles.subtitle}>Últimos Intentos:</h3>
              <div style={styles.attemptsList}>
                {historial.recent_attempts.map((attempt) => (
                  <div 
                    key={attempt.id} 
                    style={{
                      ...styles.attemptCard,
                      borderLeft: `4px solid ${attempt.is_correct ? '#2ecc71' : '#e74c3c'}`
                    }}
                  >
                    <h4 style={styles.attemptTitle}>
                      {attempt.is_correct ? '✅' : '❌'} {attempt.cycle.title}
                    </h4>
                    <p style={styles.attemptDescription}>{attempt.cycle.description}</p>
                    <div style={styles.attemptDetails}>
                      <span style={styles.badge}>
                        {attempt.cycle.loop_type.toUpperCase()}
                      </span>
                      <span style={styles.badge}>
                        {attempt.cycle.difficulty}
                      </span>
                      <span style={styles.badge}>
                        {attempt.cycle.points} pts
                      </span>
                      <span style={styles.badge}>
                        {attempt.execution_time_ms}ms
                      </span>
                    </div>
                    <p style={styles.attemptDate}>
                      📅 {new Date(attempt.created_at).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '1000px',
    margin: '20px auto',
    padding: '20px',
    backgroundColor: '#f5f5f5',
    borderRadius: '10px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
  },
  title: {
    color: '#2c3e50',
    textAlign: 'center',
    marginBottom: '20px'
  },
  subtitle: {
    color: '#34495e',
    marginTop: '30px',
    marginBottom: '15px'
  },
  searchBox: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '8px',
    marginBottom: '20px'
  },
  searchRow: {
    display: 'flex',
    gap: '10px'
  },
  label: {
    fontWeight: 'bold',
    marginBottom: '10px',
    display: 'block',
    color: '#2c3e50'
  },
  input: {
    flex: 1,
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '5px',
    fontSize: '14px'
  },
  button: {
    backgroundColor: '#3498db',
    color: 'white',
    padding: '10px 20px',
    border: 'none',
    borderRadius: '5px',
    fontSize: '14px',
    fontWeight: 'bold',
    cursor: 'pointer'
  },
  error: {
    backgroundColor: '#e74c3c',
    color: 'white',
    padding: '15px',
    borderRadius: '5px',
    marginBottom: '20px',
    textAlign: 'center'
  },
  results: {
    marginTop: '20px'
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gap: '15px',
    marginBottom: '30px'
  },
  statCard: {
    backgroundColor: '#3498db',
    color: 'white',
    padding: '20px',
    borderRadius: '8px',
    textAlign: 'center'
  },
  statNumber: {
    fontSize: '32px',
    fontWeight: 'bold',
    marginBottom: '5px'
  },
  statLabel: {
    fontSize: '14px',
    opacity: 0.9
  },
  progressGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '20px',
    marginTop: '20px'
  },
  progressCard: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
  },
  progressTitle: {
    color: '#2c3e50',
    marginBottom: '15px'
  },
  progressInfo: {
    fontSize: '14px',
    color: '#34495e'
  },
  progressBar: {
    width: '100%',
    height: '20px',
    backgroundColor: '#ecf0f1',
    borderRadius: '10px',
    overflow: 'hidden',
    marginTop: '10px'
  },
  progressFill: {
    height: '100%',
    transition: 'width 0.3s ease'
  },
  attemptsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
    marginTop: '20px'
  },
  attemptCard: {
    backgroundColor: 'white',
    padding: '15px',
    borderRadius: '8px',
    boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
  },
  attemptTitle: {
    color: '#2c3e50',
    marginBottom: '8px'
  },
  attemptDescription: {
    color: '#7f8c8d',
    fontSize: '14px',
    marginBottom: '10px'
  },
  attemptDetails: {
    display: 'flex',
    gap: '10px',
    flexWrap: 'wrap',
    marginBottom: '10px'
  },
  badge: {
    backgroundColor: '#ecf0f1',
    color: '#2c3e50',
    padding: '5px 10px',
    borderRadius: '15px',
    fontSize: '12px',
    fontWeight: 'bold'
  },
  attemptDate: {
    fontSize: '12px',
    color: '#95a5a6',
    marginTop: '5px'
  }
};

export default VerHistorial;