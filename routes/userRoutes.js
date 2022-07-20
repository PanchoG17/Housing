import express from "express";

import { formLogin, formRegister, formPasswordRestore} from "../controllers/userController.js";

const router = express.Router();

router.get('/login', formLogin)
router.get('/register', formRegister)
router.get('/restore', formPasswordRestore)

export default router