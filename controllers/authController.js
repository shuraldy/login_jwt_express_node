const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');

// Controlador para mostrar la página de registro
exports.getRegisterPage = (req, res) => {
  res.sendFile(path.join(__dirname, '../public', 'register.html'));
};

// Controlador para el registro de usuarios
exports.register = async (req, res) => {
  const { username, password, rol } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const sql = 'INSERT INTO users (username, password, rol) VALUES (?, ?, ?)';
    db.query(sql, [username, hashedPassword, rol || 'user'], (err, result) => {
      if (err) {
        console.error('Error en la consulta SQL:', err);
        return res.status(500).json({ error: 'Error en el registro' });
      }
      res.redirect('/api/auth/login');
    });
  } catch (error) {
    console.error('Error al hashear la contraseña o en el registro:', error);
    res.status(500).json({ error: 'Error en el registro' });
  }
};

// Controlador para mostrar la página de login
exports.getLoginPage = (req, res) => {
  res.sendFile(path.join(__dirname, '../public', 'login.html'));
};

// Controlador de login de usuarios
exports.login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const sql = 'SELECT * FROM users WHERE username = ?';
    db.query(sql, [username], async (err, results) => {
      if (err || results.length === 0) {
        return res.status(400).json({ error: 'Credenciales incorrectas' });
      }
      const user = results[0];
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ error: 'Credenciales incorrectas' });
      }

      // Generar token JWT
      const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

      // Guardar el token en una cookie (segura y httpOnly)
      res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', maxAge: 3600000 });
      res.redirect('/api/auth/dashboard'); // Redirigir al dashboard después del login exitoso
    });
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    res.status(500).json({ error: 'Error al iniciar sesión' });
  }
};

// Controlador para mostrar el dashboard (protegido)
exports.getDashboardPage = (req, res) => {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
  res.set('Pragma', 'no-cache');
  res.set('Expires', '0');
  res.sendFile(path.join(__dirname, '../public', 'dashboard.html'));
};

// Controlador de cierre de sesión
exports.logout = (req, res) => {
  // Limpiar la cookie del token para cerrar la sesión
  res.clearCookie('token', { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
  res.redirect('/api/auth/login'); // Redirigir al login después de cerrar sesión
};
