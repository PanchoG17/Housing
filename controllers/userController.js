import { check, validationResult } from 'express-validator';
import User from '../models/User.js'
import { generarToken } from '../helpers/tokens.js'

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

    // Extraer datos del request
    const { nombre, email, password} = req.body

    await check('nombre').notEmpty().withMessage('El nombre es obligatorio').run(req)
    await check('email').isEmail().withMessage('Ingrese un email válido').run(req)
    await check('password').isLength({min: 6}).withMessage('La contraseña debe tener al menos 6 caracteres').run(req)
    await check('password_repeat').equals(password).withMessage('Las contraseñas no coinciden').run(req)

    let resultado = validationResult(req)

    // Comprobar validaciones del formulario
    if (!resultado.isEmpty(resultado)) {
        return res.render('auth/register', {
            title: 'Registrarse',
            errores: resultado.array(),
            user: { nombre, email }
        })
    }

    // Comprobar si el usuario ya existe
    let existeUsuario = await User.findOne({ where: { email }})
    if (existeUsuario) {
        return res.render('auth/register', {
            title: 'Registrarse',
            errores: [{msg: 'El usuario ya se encuentra registrado'}],
            user: { nombre, email }
        })
    }
    else{

        //Crear nuevo usuario
        const usuario = await User.create({
            nombre,
            email,
            password,
            token: generarToken()
        });

        return res.render('auth/register', {
            title: 'Registrarse',
            success: [
                {msg: 'Usuario registrado correctamente'},
                {msg: `Se envió un mail de verificación a ${email}`}
            ]
        })

    }
}

export {
    formLogin,
    formRegister,
    formPasswordRestore,
    userRegister
}