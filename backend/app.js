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
    console.error(error);
    res.status(500).json({ message: 'Error del servidor' });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Backend corriendo en http://localhost:${PORT}`);
});