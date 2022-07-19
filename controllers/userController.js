const formLogin = (req, res) => {

    res.render('auth/login.pug', {

        activo: false

    });
}

const formRegister = (req, res) => {

    res.render('auth/register.pug', {

        title: "Registrarse"

    });
}

export {
    formLogin,
    formRegister
}