import express from 'express'; // Importar modulo express
import usuarioRoutes from './routes/userRoutes.js' // Importar routes
import db from './config/db.js' // Import DB

// Instanciar servidor express
const app = express();

try {
    await db.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }

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

    console.log(`Server is RUNNING in port ${port}`);

})