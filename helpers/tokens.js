import jwt from 'jsonwebtoken';

const generarJWT = data => jwt.sign({ id: data.id, nombre: data.nombre }, process.env.JWT_SECRET , { expiresIn: '1d' })
const generarToken = () => Math.random().toString(32).substring(2) + Date.now().toString(32);



export {
    generarJWT,
    generarToken
}