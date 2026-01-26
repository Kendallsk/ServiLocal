const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || '',
  database: process.env.DB_NAME || 'servilocal2',
  waitForConnections: true,
  connectionLimit: 10,
});

// Login (funciona para admin, cliente y prestador)
app.post('/api/auth/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Faltan credenciales' });
  }

  try {
    const [rows] = await pool.query(
      'SELECT * FROM usuarios WHERE username = ? AND password = ?',
      [username, password]
    );

    if (rows.length === 0) {
      return res.status(401).json({ message: 'Credenciales incorrectas' });
    }

    const user = rows[0];

    res.json({
      success: true,
      message: 'Login exitoso',
      user: {
        id: user.id,
        nombre: user.nombre,
        rol: user.rol
      }
    });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
});

// Registro de PRESTADOR (campos completos, sin estado ni foto por ahora)
app.post('/api/auth/register/prestador', async (req, res) => {
  const { nombre, cedula, username, password, telefono, oficio, ciudad, direccion, horario } = req.body;

  if (!nombre || !cedula || !username || !password || !telefono || !oficio || !ciudad || !horario) {
    return res.status(400).json({ message: 'Faltan campos requeridos' });
  }

  try {
    // Parsear horario JSON: {dias: "...", inicio: "HH:MM", fin: "HH:MM"}
    let dias_atencion = '';
    let horario_inicio = '';
    let horario_fin = '';

    try {
      const horarioData = JSON.parse(horario);
      dias_atencion = horarioData.dias || '';
      horario_inicio = horarioData.inicio ? `${horarioData.inicio}:00` : '';
      horario_fin = horarioData.fin ? `${horarioData.fin}:00` : '';
    } catch (e) {
      return res.status(400).json({ message: 'Formato de horario inválido' });
    }

    if (!dias_atencion || !horario_inicio || !horario_fin) {
      return res.status(400).json({ message: 'Horario incompleto' });
    }

    const [existing] = await pool.query('SELECT * FROM usuarios WHERE username = ?', [username]);
    if (existing.length > 0) {
      return res.status(400).json({ message: 'El usuario ya existe' });
    }

    await pool.query(
      'INSERT INTO usuarios (nombre, cedula, username, password, telefono, oficio, ciudad, direccion, dias_atencion, horario_inicio, horario_fin, rol) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, "prestador")',
      [nombre, cedula, username, password, telefono, oficio, ciudad, direccion, dias_atencion, horario_inicio, horario_fin]
    );

    res.json({ success: true, message: 'Registro exitoso' });
  } catch (error) {
    console.error('Error al registrar prestador:', error);
    res.status(500).json({ message: 'Error al registrar prestador' });
  }
});

// Obtener todos los usuarios
app.get('/api/usuarios', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT id, nombre, username, rol FROM usuarios ORDER BY id DESC');
    res.json({ usuarios: rows });
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    res.status(500).json({ message: 'Error al obtener usuarios' });
  }
});

// Obtener prestadores
app.get('/api/prestadores', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT id, nombre, username, oficio, ciudad FROM usuarios WHERE rol = "prestador" ORDER BY id DESC');
    res.json({ prestadores: rows });
  } catch (error) {
    console.error('Error al obtener prestadores:', error);
    res.status(500).json({ message: 'Error al obtener prestadores' });
  }
});

// Obtener estadísticas
app.get('/api/estadisticas', async (req, res) => {
  try {
    const [totalUsuarios] = await pool.query('SELECT COUNT(*) as count FROM usuarios');
    const [totalPrestadores] = await pool.query('SELECT COUNT(*) as count FROM usuarios WHERE rol = "prestador"');
    const [totalClientes] = await pool.query('SELECT COUNT(*) as count FROM usuarios WHERE rol = "cliente"');
    
    res.json({
      estadisticas: {
        totalUsuarios: totalUsuarios[0].count,
        totalPrestadores: totalPrestadores[0].count,
        totalClientes: totalClientes[0].count
      }
    });
  } catch (error) {
    console.error('Error al obtener estadísticas:', error);
    res.status(500).json({ message: 'Error al obtener estadísticas' });
  }
});

// Eliminar usuario
app.delete('/api/usuarios/:id', async (req, res) => {
  const { id } = req.params;
  
  try {
    const [result] = await pool.query('DELETE FROM usuarios WHERE id = ?', [id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    
    res.json({ success: true, message: 'Usuario eliminado' });
  } catch (error) {
    console.error('Error al eliminar usuario:', error);
    res.status(500).json({ message: 'Error al eliminar usuario' });
  }
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Backend corriendo en http://localhost:${PORT}`);
});