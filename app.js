import express from 'express'; // Importar modulo express
import csrf from 'csurf';
import cookieParser from 'cookie-parser';

import usuarioRoutes from './routes/userRoutes.js' // Importar routes
import propiedadesRoutes from './routes/propiedadesRoutes.js' // Importar routes

import db from './config/db.js' // Import DB

// Instanciar servidor express
const app = express();

// Habilitar request desde formularios
app.use(express.urlencoded({ extended:true }))

// Habilitar Cookie Parser
app.use( cookieParser() )

// Habilitar CSRF
app.use( csrf({cookie: true}))

try {
    await db.authenticate();

    // Sincronizar modelos a la BD (Migración)
    db.sync()
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
app.use('/' , propiedadesRoutes)


// Definir puerto
const port = process.env.PORT || 3000;

// Inicializar servidor en puerto asignado
app.listen(port, () => {

    console.log(`Server is RUNNING in port ${port}`);

})