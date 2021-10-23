const express = require('express');//Importar la dependencia "express"
const conectarDB = require('./config/db');//Importamos el archivo 'config/db.js' que contiene la configuracion a la BD de Mongo

/**
 * Instalar la dependencia "cors" requerida para permitir que en el backend pueda resibir "Solicitudes De Origen Cruzado" (Solicitud CORS)
 * Para esto ejecutar el siguiente comando:    npm i cors
 */
const cors = require('cors');//Importar la dependencia "cors"

//Crear el Servidor con la dependencia "express"
const app = express();

//Conectar a la BD
conectarDB();

//Habilitar CORS "Solicitudes De Origen Cruzado", poder recibir peticiones de otro dominio
//app.use(cors());
app.use(cors({ credentials: true, origin: true }));
app.options("*", cors());

//Habilitar express.json, nos va a permitir leer datos que el usuario coloque
//Cuando se coloca "express.json", se tiene que enviar el HEADER como "application/json"
app.use( express.json( { extended: true } ) );

//Crear puerto de la app para el back-end, ¿por que el 4000?, puede ser cualquier numero pero que no sea 3000, ya que este puerto esta asignado al front-end.
//una vez que estemos trabajando con el "cliente-front-end" y el "servidor-back-end", si tenemos el mismo puerto van a chocar. 
//Para el "cliente-front-end" usaremos el puerto 3000 y para el "servidor-back-end" el 4000.
//Si existe "process.env.PORT" se asigna a PORT, si NO existe "process.env.PORT" se asigna el 4000 a PORT.
//Heroku que es la plataforma donde se alojara el proyecto, va a buscar la variable de entorno "process.env.PORT"
const port = process.env.PORT || 4000;//PUERTO DE LA APP

//Importar las rutas creadas en el archivo "routes/usuarios.js" para el endpoint '/api/usuarios'
app.use('/api/usuarios', require('./routes/usuarios'));
//Importar las rutas creadas en el archivo "routes/auth.js" para el endpoint '/api/auth'
app.use('/api/auth', require('./routes/auth'));
//Importar las rutas creadas en el archivo "routes/proyectos.js" para el endpoint '/api/proyectos'
app.use('/api/proyectos', require('./routes/proyectos'));
//Importar las rutas creadas en el archivo "routes/tareas.js" para el endpoint '/api/tareas'
app.use('/api/tareas', require('./routes/tareas'));

//Definir la página principal, solo como prueba de que esta funcionando la URL http://localhost:4000/ y se muestra correctamente
//Entonces cuando visite la página principal definida en get por: '/'
/* app.get('/', (req, res) => {
    res.send('Hola mundo desde el mas alla');
}) */

//Ejecutar la app, ó el servidor, "port" correponde al puerto y '0,0,0,0' corresponde al dominio que lo va a asignar Heroku
app.listen(port, () => {//ARRANCAR EL SERV.
    console.log(`El servidor esta funcionando en el puerto ${port}`);
})