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

/* TEST */
app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend funcionando OK' });
});

/* LOGIN */
app.post('/api/auth/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const [rows] = await pool.query(
      'SELECT id, nombre, rol FROM usuarios WHERE username=? AND password=?',
      [username, password]
    );

    if (rows.length === 0) {
      return res.status(401).json({ message: 'Credenciales incorrectas' });
    }

    res.json({ success: true, user: rows[0] });
  } catch (err) {
    res.status(500).json({ message: 'Error del servidor' });
  }
});

/* REGISTRO PRESTADOR */
app.post('/api/auth/register/prestador', async (req, res) => {
  const {
    nombre,
    cedula,
    username,
    password,
    telefono,
    oficio,
    ciudad,
    direccion,
    horario
  } = req.body;

  try {
    const horarioData = JSON.parse(horario);

    await pool.query(
      `INSERT INTO usuarios 
      (nombre, cedula, username, password, telefono, oficio, ciudad, direccion,
       dias_atencion, horario_inicio, horario_fin, rol)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'prestador')`,
      [
        nombre,
        cedula,
        username,
        password,
        telefono,
        oficio,
        ciudad,
        direccion,
        horarioData.dias,
        `${horarioData.inicio}:00`,
        `${horarioData.fin}:00`
      ]
    );

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al registrar' });
  }
});

/* PRESTADORES POR OFICIO */
app.get('/api/prestadores', async (req, res) => {
  const { oficio } = req.query;

  try {
    const [rows] = await pool.query(
      `SELECT nombre, telefono, ciudad, direccion 
       FROM usuarios 
       WHERE rol='prestador' AND oficio=?`,
      [oficio]
    );

    res.json(rows);
  } catch {
    res.status(500).json({ message: 'Error del servidor' });
  }
});

app.listen(3000, () => {
  console.log('Backend corriendo en http://localhost:3000');
});
