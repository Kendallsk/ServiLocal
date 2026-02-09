const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

app.use('/uploads', express.static(uploadsDir));

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'servilocal',
  waitForConnections: true,
  connectionLimit: 10,
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${unique}${ext}`);
  }
});

const fileFilter = (req, file, cb) => {
  const allowed = ['image/jpeg', 'image/png', 'image/jpg'];
  if (!allowed.includes(file.mimetype)) {
    return cb(new Error('Solo se permiten imágenes (jpg, jpeg, png)'));
  }
  cb(null, true);
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }
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
      'SELECT id, nombre, rol, estado FROM usuarios WHERE username=? AND password=?',
      [username, password]
    );

    if (rows.length === 0) {
      return res.status(401).json({ message: 'Credenciales incorrectas' });
    }

    const user = rows[0];

    // Verificar estado si es prestador
    if (user.rol === 'prestador' && user.estado === 'rechazado') {
      return res.status(403).json({ message: 'El perfil fue desaprobado' });
    }

    if (user.rol === 'prestador' && user.estado === 'pendiente') {
      return res.status(403).json({ message: 'Tu cuenta está pendiente de aprobación' });
    }

    res.json({ success: true, user: { id: user.id, nombre: user.nombre, rol: user.rol } });
  } catch (err) {
    res.status(500).json({ message: 'Error del servidor' });
  }
});

/* REGISTRO PRESTADOR */
app.post('/api/auth/register/prestador', upload.single('foto'), async (req, res) => {
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
    if (!req.file) {
      return res.status(400).json({ message: 'La foto es obligatoria' });
    }

    const horarioData = JSON.parse(horario);

    const usernameNormalized = String(username || '').trim();
    const cedulaNormalized = String(cedula || '').trim();

    // Validar usuario duplicado
    const [existingUser] = await pool.query(
      'SELECT id FROM usuarios WHERE username = ? LIMIT 1',
      [usernameNormalized]
    );
    if (existingUser.length > 0) {
      return res.status(409).json({ message: 'Este usuario ya existe' });
    }

    const fotoPath = `/uploads/${req.file.filename}`;

    await pool.query(
      `INSERT INTO usuarios 
      (nombre, cedula, username, password, telefono, oficio, ciudad, direccion,
       dias_atencion, horario_inicio, horario_fin, rol, foto, estado)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'prestador', ?, 'pendiente')`,
      [
        nombre,
        cedulaNormalized,
        usernameNormalized,
        password,
        telefono,
        oficio,
        ciudad,
        direccion,
        horarioData.dias,
        `${horarioData.inicio}:00`,
        `${horarioData.fin}:00`,
        fotoPath
      ]
    );

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al registrar' });
  }
});

/* OBTENER TODOS LOS USUARIOS */
app.get('/api/usuarios', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM usuarios');
    res.json({ usuarios: rows });
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    res.status(500).json({ message: 'Error al obtener usuarios' });
  }
});

/* PRESTADORES POR OFICIO (solo aprobados para servicios públicos) */
app.get('/api/prestadores', async (req, res) => {
  const { oficio, incluirPendientes } = req.query;

  try {
    let query = 'SELECT * FROM usuarios WHERE rol="prestador"';
    const params = [];

    // Solo mostrar aprobados en servicios públicos, a menos que se solicite explícitamente
    if (!incluirPendientes) {
      query += ' AND estado = "aprobado"';
    }

    if (oficio) {
      query += ' AND oficio = ?';
      params.push(oficio);
    }

    const [rows] = await pool.query(query, params);
    res.json({ prestadores: rows });
  } catch (error) {
    console.error(error);
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

// Obtener prestador por ID
app.get('/api/prestador/:id', async (req, res) => {
  const { id } = req.params;
  
  try {
    const [rows] = await pool.query('SELECT * FROM usuarios WHERE id = ? AND rol = "prestador"', [id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Prestador no encontrado' });
    }
    
    res.json({ prestador: rows[0] });
  } catch (error) {
    console.error('Error al obtener prestador:', error);
    res.status(500).json({ message: 'Error al obtener prestador' });
  }
});

// Actualizar datos del prestador
app.put('/api/prestador/:id', async (req, res) => {
  const { id } = req.params;
  const { nombre, cedula, telefono, oficio, ciudad, direccion, dias_atencion, horario_inicio, horario_fin } = req.body;
  
  try {
    const [result] = await pool.query(
      'UPDATE usuarios SET nombre = ?, cedula = ?, telefono = ?, oficio = ?, ciudad = ?, direccion = ?, dias_atencion = ?, horario_inicio = ?, horario_fin = ? WHERE id = ? AND rol = "prestador"',
      [nombre, cedula, telefono, oficio, ciudad, direccion, dias_atencion, horario_inicio, horario_fin, id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Prestador no encontrado' });
    }
    
    res.json({ success: true, message: 'Datos actualizados correctamente' });
  } catch (error) {
    console.error('Error al actualizar prestador:', error);
    res.status(500).json({ message: 'Error al actualizar prestador' });
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

/* OBTENER PRESTADORES PENDIENTES */
app.get('/api/prestadores/pendientes', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM usuarios WHERE rol = "prestador" AND estado = "pendiente" ORDER BY id DESC'
    );
    res.json({ prestadores: rows });
  } catch (error) {
    console.error('Error al obtener prestadores pendientes:', error);
    res.status(500).json({ message: 'Error al obtener prestadores pendientes' });
  }
});

/* APROBAR PRESTADOR */
app.put('/api/prestadores/:id/aprobar', async (req, res) => {
  const { id } = req.params;
  
  try {
    const [result] = await pool.query(
      'UPDATE usuarios SET estado = "aprobado" WHERE id = ? AND rol = "prestador"',
      [id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Prestador no encontrado' });
    }
    
    res.json({ success: true, message: 'Prestador aprobado exitosamente' });
  } catch (error) {
    console.error('Error al aprobar prestador:', error);
    res.status(500).json({ message: 'Error al aprobar prestador' });
  }
});

/* RECHAZAR PRESTADOR */
app.put('/api/prestadores/:id/rechazar', async (req, res) => {
  const { id } = req.params;
  
  try {
    const [result] = await pool.query(
      'UPDATE usuarios SET estado = "rechazado" WHERE id = ? AND rol = "prestador"',
      [id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Prestador no encontrado' });
    }
    
    res.json({ success: true, message: 'Prestador rechazado' });
  } catch (error) {
    console.error('Error al rechazar prestador:', error);
    res.status(500).json({ message: 'Error al rechazar prestador' });
  }
});

app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ message: err.message });
  }
  if (err && err.message && err.message.includes('imágenes')) {
    return res.status(400).json({ message: err.message });
  }
  return res.status(500).json({ message: 'Error del servidor' });
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Backend corriendo en http://localhost:${PORT}`);
});
