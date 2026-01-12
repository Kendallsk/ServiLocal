const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');

const app = express();

app.use(cors());
app.use(express.json());

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'servilocal',
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

// Registro de CLIENTE (solo campos básicos)
app.post('/api/auth/register/cliente', async (req, res) => {
  const { nombre, username, password, telefono, ciudad } = req.body;

  if (!nombre || !username || !password || !telefono || !ciudad) {
    return res.status(400).json({ message: 'Faltan campos requeridos' });
  }

  try {
    const [existing] = await pool.query('SELECT * FROM usuarios WHERE username = ?', [username]);
    if (existing.length > 0) {
      return res.status(400).json({ message: 'El usuario ya existe' });
    }

    await pool.query(
      'INSERT INTO usuarios (nombre, username, password, telefono, ciudad, rol) VALUES (?, ?, ?, ?, ?, "cliente")',
      [nombre, username, password, telefono, ciudad]
    );

    res.json({ success: true, message: 'Cliente registrado correctamente' });
  } catch (error) {
    console.error('Error al registrar cliente:', error);
    res.status(500).json({ message: 'Error al registrar cliente' });
  }
});

// Registro de PRESTADOR (campos completos, sin estado ni foto por ahora)
app.post('/api/auth/register/prestador', async (req, res) => {
  const { nombre, username, password, telefono, oficio, ciudad, horario } = req.body;

  if (!nombre || !username || !password || !telefono || !oficio || !ciudad || !horario) {
    return res.status(400).json({ message: 'Faltan campos requeridos' });
  }

  try {
    const [existing] = await pool.query('SELECT * FROM usuarios WHERE username = ?', [username]);
    if (existing.length > 0) {
      return res.status(400).json({ message: 'El usuario ya existe' });
    }

    await pool.query(
      'INSERT INTO usuarios (nombre, username, password, telefono, oficio, ciudad, horario, rol) VALUES (?, ?, ?, ?, ?, ?, ?, "prestador")',
      [nombre, username, password, telefono, oficio, ciudad, horario]
    );

    res.json({ success: true, message: 'Registro exitoso' });
  } catch (error) {
    console.error('Error al registrar prestador:', error);
    res.status(500).json({ message: 'Error al registrar prestador' });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Backend corriendo en http://localhost:${PORT}`);
});