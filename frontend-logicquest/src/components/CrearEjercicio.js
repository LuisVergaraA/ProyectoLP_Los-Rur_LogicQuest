import React, { useState } from 'react';
import axios from 'axios';

function CrearEjercicio() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    difficulty: 'facil',
    loop_type: 'for',
    input: '',
    output: '',
    points: 10
  });
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje('');
    setError('');

    try {
      const response = await axios.post('http://127.0.0.1:8000/api/v1/ciclos', {
        title: formData.title,
        description: formData.description,
        difficulty: formData.difficulty,
        loop_type: formData.loop_type,
        test_cases: [
          {
            input: formData.input,
            output: formData.output
          }
        ],
        points: parseInt(formData.points)
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      if (response.data.success) {
        setMensaje(`✅ Ejercicio "${response.data.data.title}" creado exitosamente!`);
        setFormData({
          title: '',
          description: '',
          difficulty: 'facil',
          loop_type: 'for',
          input: '',
          output: '',
          points: 10
        });
      }
    } catch (err) {
      setError('❌ Error al crear el ejercicio: ' + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>🔁 Crear Ejercicio de Ciclos</h2>
      
      {mensaje && <div style={styles.success}>{mensaje}</div>}
      {error && <div style={styles.error}>{error}</div>}

      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.formGroup}>
          <label style={styles.label}>Título del Ejercicio:</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            style={styles.input}
            placeholder="Ej: Suma del 1 al 10"
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Descripción:</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            style={styles.textarea}
            placeholder="Describe el ejercicio..."
          />
        </div>

        <div style={styles.row}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Dificultad:</label>
            <select
              name="difficulty"
              value={formData.difficulty}
              onChange={handleChange}
              style={styles.select}
            >
              <option value="facil">Fácil</option>
              <option value="medio">Medio</option>
              <option value="dificil">Difícil</option>
            </select>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Tipo de Bucle:</label>
            <select
              name="loop_type"
              value={formData.loop_type}
              onChange={handleChange}
              style={styles.select}
            >
              <option value="for">For</option>
              <option value="while">While</option>
            </select>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Puntos:</label>
            <input
              type="number"
              name="points"
              value={formData.points}
              onChange={handleChange}
              min="1"
              style={styles.input}
            />
          </div>
        </div>

        <h3 style={styles.subtitle}>Caso de Prueba:</h3>
        
        <div style={styles.row}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Entrada (Input):</label>
            <input
              type="text"
              name="input"
              value={formData.input}
              onChange={handleChange}
              required
              style={styles.input}
              placeholder="Ej: 10"
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Salida Esperada (Output):</label>
            <input
              type="text"
              name="output"
              value={formData.output}
              onChange={handleChange}
              required
              style={styles.input}
              placeholder="Ej: 55"
            />
          </div>
        </div>

        <button type="submit" style={styles.button}>
          Crear Ejercicio
        </button>
      </form>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '800px',
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
    marginTop: '20px',
    marginBottom: '10px'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px'
  },
  formGroup: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column'
  },
  row: {
    display: 'flex',
    gap: '15px'
  },
  label: {
    fontWeight: 'bold',
    marginBottom: '5px',
    color: '#2c3e50'
  },
  input: {
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '5px',
    fontSize: '14px'
  },
  textarea: {
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '5px',
    fontSize: '14px',
    minHeight: '100px',
    resize: 'vertical'
  },
  select: {
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '5px',
    fontSize: '14px'
  },
  button: {
    backgroundColor: '#3498db',
    color: 'white',
    padding: '15px',
    border: 'none',
    borderRadius: '5px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    marginTop: '20px'
  },
  success: {
    backgroundColor: '#2ecc71',
    color: 'white',
    padding: '15px',
    borderRadius: '5px',
    marginBottom: '20px',
    textAlign: 'center'
  },
  error: {
    backgroundColor: '#e74c3c',
    color: 'white',
    padding: '15px',
    borderRadius: '5px',
    marginBottom: '20px',
    textAlign: 'center'
  }
};

export default CrearEjercicio;
