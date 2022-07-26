import { DataTypes } from "sequelize";
import bcrypt from 'bcrypt';

import db from '../config/db.js'

const User = db.define('usuarios', {

    nombre: {
        type : DataTypes.STRING,
        allowNull: false
    },
    email: {
        type : DataTypes.STRING,
        allowNull: false
    },
    password: {
        type : DataTypes.STRING,
        allowNull: false
    },
    token: DataTypes.STRING,
    confirmado: DataTypes.BOOLEAN

},{
    hooks: {

        // Hashear contraseña antes de guardar el usuario usando BCRYPT
        beforeCreate: async function(usuario) {
            const salt = await bcrypt.genSalt(10);
            usuario.password = await bcrypt.hash(usuario.password, salt);
        }

    }
})

// Metodos Personalizados

User.prototype.checkPassword = function(password){

    return bcrypt.compareSync(password, this.password)

}

export default User