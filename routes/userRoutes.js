import express from "express";

import { formLogin, formRegister, formPasswordRestore, restorePassword, comprobarToken, cambiarPassword, userRegister, confirmarUsuario} from "../controllers/userController.js";

const router = express.Router();

// Login de usuarios
router.get('/login', formLogin)


// Registro de usuario
router.route('/registrar')
    .get(formRegister)
    .post(userRegister)

router.get('/confirmar/:token', confirmarUsuario)


// Restablecimiento de contraseña
router.route('/restore')
    .get(formPasswordRestore)
    .post(restorePassword)

router.route('/restore/:token')
    .get(comprobarToken)
    .post(cambiarPassword)


export default router