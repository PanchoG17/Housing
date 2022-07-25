import express from "express";

import { formLogin, formRegister, formPasswordRestore, userRegister, confirmarUsuario} from "../controllers/userController.js";

const router = express.Router();

router.get('/login', formLogin)
router.get('/restore', formPasswordRestore)

router.route('/registrar')
    .get(formRegister)
    .post(userRegister)

router.get('/confirmar/:token', confirmarUsuario)

export default router