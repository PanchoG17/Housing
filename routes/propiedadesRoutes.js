import  express from "express";
import { admin, crear } from "../controllers/propiedadesController.js";

const router = express.Router()

router.get('/propiedades', admin)
router.get('/propiedades/crear', crear)

export default router