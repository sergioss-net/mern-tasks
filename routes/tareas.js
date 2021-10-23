//Rutas para la creacion, edicion, eliminacion y listado de tareas
const express = require('express');//Importar express
const router = express.Router();//La funcion "Router()" de "express" es requerida para poder usar los verbos de HTTP como POST, GET, PUT y DELETE en el endpoint de "api/tareas"
const tareaController = require('../controllers/tareaController');//Importar controlador "proyectoController.js"
const auth = require('../middleware/auth');//Importar middleware "auth.js" para la autenticación del usuario

//Para agregar "REGLAS DE VALIDACIÓN" se usa la funcion "check()" de la dependencia "express-validator".
//se instala la dependencia "express-validator", dentro de nuestro "servidor-back-end" con el siguiente comando:
//   npm i express-validator
const { check } = require('express-validator');//Importamos la funcion "check" de la dependencia "express-validator"

/**
 * Middleware para el endpoint "api/tareas" que atendera al verbo POST de HTTP.
 * Que apunta a la funcion "crearTarea" del controlador "tareaController" para crear una "tarea" nueva que se le asignara a un 
 * "proyecto" ya creado y validado de que exista, que le pertenecera al usuario que este autenticado.
 * Recibe un REQUEST de tipo POST hacia la URL "api/tareas". Ruta local del endpoint: http://localhost:4000/api/tareas
 * Cuando hagamos un POST hacia esta API "api/tareas", API definida en el archivo "servidor-back-eng/index.js".
 * Al poner aqui solo la diagonal '/' esto indicara que sera "api/tareas".
 */
router.post('/',
    auth,//1ro revisamos que el usuario este autenticado con el Middleware "auth.js" que verifica que el usuario este autenticado, validando el Token si pertenece al proyecto
    [//Agregando las "REGLAS DE VALIDACIÓN": Campo a validar, Cual va a ser su mensaje de error y que reglas van a plicar
        check('nombre', 'El nombre de la tarea es obligatorio').not().isEmpty(),//Revisa que el campo nombre NO este VACIO
        check('proyecto', 'El nombre del proyecto es obligatorio').not().isEmpty()//Revisa que el campo proyecto NO este VACIO
    ],
    tareaController.crearTarea//funcion "crearTarea" del controlador "tareaController" que resolvera al verbo POST
);

/**
 * Middleware para el endpoint "api/tareas" que atendera al verbo GET de HTTP.
 * Que apunta a la funcion "obtenerTareas" del controlador "tareaController", para obtener las lista 
 * de tareas de un proyecto en especifico del usuario que este autenticado
 * Recibe un REQUEST de tipo GET hacia la URL "api/tareas". Ruta local del endpoint: http://localhost:4000/api/tareas
 * Cuando hagamos un GET hacia esta API "api/tareas", API definida en el archivo "servidor-back-eng/index.js".
 * Al poner aqui solo la diagonal '/' esto indicara que sera "api/tareas".
 */
router.get('/',
    auth,//1ro revisamos que el usuario este autenticado con el Middleware "auth.js" que verifica que el usuario este autenticado, validando el Token si pertenece al proyecto
    tareaController.obtenerTareas//funcion "obtenerTareas" del controlador "tareaController" que resolvera al verbo GET
);

/**
 * Middleware para el endpoint "api/tareas" que atendera al verbo PUT de HTTP.
 * Que apunta a la funcion "actualizarTarea" del controlador "tareaController", actualiza una tarea, permitiendo actualizar el nombre 
 * de una tarea asi como cambiar el estado de una tarea de incompleta a incompleta, perteneceiente a un proyecto de un usuario autenticado.
 * Recibe un REQUEST de tipo PUT hacia la URL "api/tareas". Ruta local del endpoint: http://localhost:4000/api/tareas
 * Cuando hagamos un PUT hacia esta API "api/tareas", API definida en el archivo "servidor-back-eng/index.js".
 * Al poner aqui solo la diagonal '/' esto indicara que sera "api/tareas", ":id" es un parametro que debe ser enviado en la URL del endpoint.
 */
router.put('/:id',
    auth,//1ro revisamos que el usuario este autenticado con el Middleware "auth.js" que verifica que el usuario este autenticado, validando el Token si pertenece al proyecto
    tareaController.actualizarTarea//funcion "actualizarTarea" del controlador "tareaController" que resolvera el verbo PUT
);

/**
 * Middleware para el endpoint "api/tareas" que atendera al verbo DELETE de HTTP.
 * Que apunta a la funcion "eliminarTarea" del controlador "tareaController", elimina una tarea perteneceiente a un proyecto de un usuario autenticado.
 * Recibe un REQUEST de tipo DELETE hacia la URL "api/tareas". Ruta local del endpoint: http://localhost:4000/api/tareas
 * Cuando hagamos un DELETE hacia esta API "api/tareas", API definida en el archivo "servidor-back-eng/index.js".
 * Al poner aqui solo la diagonal '/' esto indicara que sera "api/tareas", ":id" es un parametro que debe ser enviado en la URL del endpoint.
 */
router.delete('/:id',
    auth,//1ro revisamos que el usuario este autenticado con el Middleware "auth.js" que verifica que el usuario este autenticado, validando el Token si pertenece al proyecto
    tareaController.eliminarTarea//funcion "eliminarTarea" del controlador "tareaController" que resolvera el verbo DELETE
);

module.exports = router;