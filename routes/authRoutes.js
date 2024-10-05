const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { verifyToken } = require('../middleware/authMiddleware');
const { noCache } = require('../middleware/noCache');

// Ruta para mostrar el formulario de registro
router.get('/register', authController.getRegisterPage);

// Ruta para manejar el registro de usuarios
router.post('/register', authController.register);

// Ruta para mostrar el formulario de login
router.get('/login', authController.getLoginPage);

// Ruta para manejar el inicio de sesión de usuarios
router.post('/login', authController.login);

// Ruta para el dashboard (solo accesible si está autenticado)
router.get('/dashboard', verifyToken, noCache, authController.getDashboardPage);

// Ruta para manejar el cierre de sesión
router.get('/logout', authController.logout);


module.exports = router;
