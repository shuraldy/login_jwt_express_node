const jwt = require('jsonwebtoken');

exports.verifyToken = (req, res, next) => {
  console.log('Verificando token para la ruta protegida...');

  // Obtener el token de las cookies
  const token = req.cookies.token;

  if (!token) {
    console.error('Token no encontrado, redirigiendo al login.');
    return res.redirect('/api/auth/login');
  }

  try {
    // Verificar el token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Token válido:', decoded);
    req.userId = decoded.userId; // Guardar el userId para su uso posterior
    next();
  } catch (error) {
    console.error('Token no válido, redirigiendo al login:', error);
    res.clearCookie('token'); // Limpiar la cookie si el token no es válido
    return res.redirect('/api/auth/login');
  }
};

