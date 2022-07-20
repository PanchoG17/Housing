const formLogin = (req, res) => {

    res.render('auth/login.pug', {

        title: "Iniciar sesión"

    });
}

const formRegister = (req, res) => {

    res.render('auth/register.pug', {

        title: "Registrarse"

    });
}

const formPasswordRestore = (req, res) => {

    res.render('auth/restore.pug', {

        title: "Restaurar contraseña"

    });
}

export {
    formLogin,
    formRegister,
    formPasswordRestore
}