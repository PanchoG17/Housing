import express from "express";

import { formLogin, autenticar, formRegister, formPasswordRestore, restorePassword, comprobarToken, cambiarPassword, userRegister, confirmarUsuario} from "../controllers/userController.js";

const router = express.Router();

// Login de usuarios
router.route('/login')
    .get(formLogin)
    .post(autenticar)

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