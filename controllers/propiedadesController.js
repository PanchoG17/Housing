

const admin = (req, res) => {
    res.render('propiedades/admin', {

        title: 'Mis propiedades',
        barra: true

    })
}

const crear = (req, res) => {

    res.render('propiedades/crear', {

        title: 'Registrar propiedad',
        barra: true

    })
}

export {
    admin,
    crear
}