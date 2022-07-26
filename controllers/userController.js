import { check, validationResult } from 'express-validator';
import bcrypt from 'bcrypt'

//Models
import User from '../models/User.js'

//Helpers
import { generarJWT, generarToken } from '../helpers/tokens.js'
import { emailRegistro, emailRestorePassword } from '../helpers/emails.js'



// LOGIN DE USUARIOS

const formLogin = (req, res) => {

    res.render('auth/login.pug', {

        title: 'Iniciar sesión',
        csrfToken: req.csrfToken(),

    });
}

const autenticar = async (req, res) => {

    // Extraer datos de request
    const { email, password} = req.body

    await check('email').isEmail().withMessage('Ingrese un email válido').run(req)

    let resultado = validationResult(req)

    // Comprobar validaciones del formulario
    if (!resultado.isEmpty(resultado)) {

        res.render('auth/login.pug', {

            title: 'Iniciar sesión',
            csrfToken: req.csrfToken(),
            errores: resultado.array(),
            user: {
                email
            }
        });
    }

    // Comprobar si el usuario ya existe
    let usuario = await User.findOne({ where: { email }})

    if (!usuario) {

        res.render('auth/login.pug', {

            title: 'Iniciar sesión',
            csrfToken: req.csrfToken(),
            errores: [{msg: 'El usuario no existe.'}],
            user: {
                email
            }
        });
    }

    // Comprobar si el usuario esta confirmado
    if (!usuario.confirmado) {

        res.render('auth/login.pug', {

            title: 'Iniciar sesión',
            csrfToken: req.csrfToken(),
            errores: [{msg: 'Tu cuenta no ha sido confirmada, por favor revisa tu correo.'}],
            user: {
                email
            }
        });
    }

    // Comprobar contraseña
    if (!usuario.checkPassword(password)) {

        res.render('auth/login.pug', {

            title: 'Iniciar sesión',
            csrfToken: req.csrfToken(),
            errores: [{msg: 'La contraseña es incorrecta'}],
            user: {
                email
            }
        })

    }else{

        //Autenticar al usuario
        const token = generarJWT({id: usuario.id, nombre: usuario.nombre})

        //Almacenar token en cookies
        return res.cookie('_token', token, {
            httpOnly: true,
            //secure: true,
            //sameSite: true
        }).redirect('/propiedades')
    }


}


// REGISTRAR USUARIOS

const formRegister = (req, res) => {

    res.render('auth/register.pug', {

        title: 'Registrarse',
        csrfToken: req.csrfToken()

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
            csrfToken: req.csrfToken(),
            user: { nombre, email }
        })
    }

    // Comprobar si el usuario ya existe
    let existeUsuario = await User.findOne({ where: { email }})
    if (existeUsuario) {
        return res.render('auth/register', {
            title: 'Registrarse',
            errores: [{msg: 'El usuario ya se encuentra registrado'}],
            csrfToken: req.csrfToken(),
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

        //Enviar mail de confirmacion

        emailRegistro ({

            nombre : usuario.nombre,
            email : usuario.email,
            token : usuario.token

        })

        return res.render('auth/register', {
            title: 'Registrarse',
            csrfToken: req.csrfToken(),
            success: [
                {msg: 'Usuario registrado correctamente'},
                {msg: `Se envió un mail de verificación a ${email}`}
            ]
        })

    }
}

const confirmarUsuario = async (req, res) => {

    const token = req.params.token;

    // Comprobar si el usuario existe
    let usuario = await User.findOne({ where: { token }});

    if (!usuario) {

        res.render('auth/confirmar.pug', {

            title: 'Confirmar cuenta',
            msg: 'No se pudo verificar el usuario, intente nuevamente mas tárde',
            error: true

        })
    }else{

        usuario.token = null;
        usuario.confirmado = true;
        await usuario.save();

        res.render('auth/confirmar.pug', {

            title: `Bienvenido ${usuario.nombre}`,
            msg: '¡Tu cuenta fue confirmada correctamente!',
            csrfToken: req.csrfToken(),
            error: false

        })
    }
}

// RESTABLECER DE CONTRASEÑA

const formPasswordRestore = (req, res) => {

    res.render('auth/restore.pug', {

        title: 'Restablecer contraseña',
        csrfToken: req.csrfToken(),

    });
}

const restorePassword = async (req, res) => {

    await check('email').isEmail().withMessage('Ingrese un email válido').run(req)

    let resultado = validationResult(req)
    const {email} = req.body

    // Comprobar validaciones del formulario
    if (!resultado.isEmpty(resultado)) {
        return res.render('auth/restore', {
            title: 'Restablecer contraseña',
            errores: resultado.array(),
            csrfToken: req.csrfToken(),
        })
    }

    // Comprobar si el usuario existe
    const usuario = await User.findOne({where : {email}})

    if (!usuario) {
        return res.render('auth/restore.pug', {

            title: 'Restablecer contraseña',
            csrfToken: req.csrfToken(),
            errores: [{msg: 'El email ingresado no está registrado a ningún usuario'}]

        });
    }else{

        usuario.token = generarToken();
        await usuario.save();

        emailRestorePassword ({

            nombre : usuario.nombre,
            email : usuario.email,
            token : usuario.token

        })

        return res.render('auth/restore', {
            title: 'Restablecer contraseña',
            csrfToken: req.csrfToken(),
            success: [
                {msg: `Se envió un mail de verificación a ${email}`},
                {msg: 'Recordá verificar la casilla de Spam'}
            ]
        })
    }
}

const comprobarToken = async (req, res) => {

    const token = req.params.token;

    // Comprobar si el usuario existe
    const usuario = await User.findOne({ where: { token }});

    if (!usuario) {
        res.render('auth/change-password.pug', {

            title: 'Restablecer contraseña',
            msg: 'No se pudo verificar el usuario, intente nuevamente mas tárde',
            error: true

        })
    }else{

        res.render('auth/change-password.pug', {

            title: 'Restablecer contraseña',
            csrfToken: req.csrfToken(),
            error: false

        })

    }
}

const cambiarPassword = async (req, res) => {

    await check('password').isLength({min: 6}).withMessage('La contraseña debe tener al menos 6 caracteres').run(req)
    await check('password_repeat').equals(req.body.password).withMessage('Las contraseñas no coinciden').run(req)

    let resultado = validationResult(req)

    // Comprobar validaciones del formulario
    if (!resultado.isEmpty(resultado)) {
        return res.render('auth/change-password', {
            title: 'Registrarse',
            errores: resultado.array(),
            csrfToken: req.csrfToken(),
        })
    }

    const token = req.params.token;
    const password = req.body.password;

    // Comprobar si el usuario existe
    const usuario = await User.findOne({ where: { token }});


    const salt = await bcrypt.genSalt(10);
    usuario.password = await bcrypt.hash(password, salt);
    usuario.token = null

    await usuario.save()

    return res.render('auth/change-password', {
        title: 'Restablecer contraseña',
        csrfToken: req.csrfToken(),
        success: [
            {msg: 'Su contraseña fue restablecida correctamente'},
        ]
    })

}


// EXPORTAR FUNCIONES

export {
    formLogin,
    autenticar,
    formRegister,
    formPasswordRestore,
    restorePassword,
    comprobarToken,
    cambiarPassword,
    userRegister,
    confirmarUsuario
}