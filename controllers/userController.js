import { check, validationResult } from 'express-validator';
import User from '../models/User.js'

const formLogin = (req, res) => {

    res.render('auth/login.pug', {

        title: 'Iniciar sesión'

    });
}

const formRegister = (req, res) => {

    res.render('auth/register.pug', {

        title: 'Registrarse'

    });
}

const formPasswordRestore = (req, res) => {

    res.render('auth/restore.pug', {

        title: 'Restaurar contraseña'

    });
}

const userRegister = async (req, res) => {

    await check('nombre').notEmpty().withMessage('El nombre es obligatorio').run(req)
    await check('email').isEmail().withMessage('Ingrese un email válido').run(req)
    await check('password').isLength({min: 6}).withMessage('La contraseña debe tener al menos 6 caracteres').run(req)
    await check('password_repeat').equals(req.body.password).withMessage('Las contraseñas no coinciden').run(req)

    let resultado = validationResult(req)

    // Comprobar validaciones del formulario
    if (!resultado.isEmpty(resultado)) {
        return res.render('auth/register', {
            title: 'Registrarse',
            errores: resultado.array(),
            user: {
                nombre : req.body.nombre,
                email : req.body.email
            }
        })
    }

    // Comprobar si el usuario ya existe
    let existeUsuario = await User.findOne({ where: {email : req.body.email }})
    if (existeUsuario) {
        return res.render('auth/register', {
            title: 'Registrarse',
            errores: [{msg: 'El usuario ya se encuentra registrado'}],
            user: {
                nombre : req.body.nombre,
                email : req.body.email
            }
        })
    }
    else{

        //Crear nuevo usuario
        const usuario = await User.create(req. body)

        return res.render('auth/register', {
            title: 'Registrarse',
            success: {msg: 'Usuario registrado correctamente'}
        })

    }
}

export {
    formLogin,
    formRegister,
    formPasswordRestore,
    userRegister
}