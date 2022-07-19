// Importar modulo express
import express from 'express';

// Importar routes
import usuarioRoutes from './routes/userRoutes.js'

// Instanciar servidor express
const app = express();

// Habilitar PUG
app.set('view engine', 'pug')
app.set('views', './views')

// Static files
app.use(express.static('public'))

// Routing
app.use('/auth' , usuarioRoutes)

// Definir puerto
const port = 3000;

// Inicializar servidor en puerto asignado
app.listen(port, () => {

    console.log(`Server running in port ${port}`);

})