//Rutas para la creacion, edicion, eliminacion y listado de proyectos
const express = require('express');//Importar express
const router = express.Router();//La funcion "Router()" de "express" es requerida para poder usar los verbos de HTTP como POST, GET, PUT y DELETE en el endpoint de "api/proyectos"
const proyectoController = require('../controllers/proyectoController');//Importar controlador "proyectoController.js"
const auth = require('../middleware/auth');//Importar middleware "auth.js" para la autenticación del usuario

//Para agregar "REGLAS DE VALIDACIÓN" se usa la funcion "check" de la dependencia "express-validator".
//se instala la dependencia "express-validator", dentro de nuestro "servidor-back-end" con el siguiente comando:
//   npm i express-validator
const { check } = require('express-validator');//Importamos la funcion "check" de la dependencia "express-validator"

/**
 * Middleware para el endpoint "api/proyectos" que atendera al verbo POST de HTTP.
 * Que apunta a la funcion "crearProyecto" del controlador "proyectoController" para crear un proyecto nuevo que le correspondera al usuario que este autenticado.
 * Recibe un REQUEST de tipo POST hacia la URL "api/proyectos". Ruta local del endpoint: http://localhost:4000/api/proyectos
 * Cuando hagamos un POST hacia esta API "api/proyectos", API definida en el archivo "servidor-back-eng/index.js".
 * Al poner aqui solo la diagonal '/' esto indicara que sera "api/proyectos".
 */
router.post('/',
    auth,//1ro revisamos que el usuario este autenticado con el Middleware que verifica que el usuario este autenticado, validando el Token si pertenece al proyecto
    [   //Agregando las "REGLAS DE VALIDACIÓN": Campo a validar, Cual va a ser su mensaje de error y que reglas van a plicar
        check('nombre', 'El nombre del proyecto es obligatorio').not().isEmpty()//Revisa que el campo nombre NO este VACIO
    ],
    proyectoController.crearProyecto//Llama a la funcion "crearProyecto" del controlador "proyectoController"
);

//Para probar el endpoint "api/proyectos" usando el verbo GET, en un vanegador Web donde ahi no es posible enviarles
//las cabeceras ni el Token en el Header, por lo que  mostrara el mensaje de: 'No hay Token, permiso no valido'
/**
 * Middleware para el endpoint "api/proyectos" que atendera al verbo GET de HTTP.
 * Que apunta a la funcion "obtenerProyectos" del controlador "proyectoController", para obtener los todos proyectos creados por el usuario que este autenticado.
 * Recibe un REQUEST de tipo GET hacia la URL "api/proyectos". Ruta local del endpoint: http://localhost:4000/api/proyectos
 * Cuando hagamos un GET hacia esta API "api/proyectos", API definida en el archivo "servidor-back-eng/index.js".
 * Al poner aqui solo la diagonal '/' esto indicara que sera "api/proyectos".
 */
router.get('/',
    auth,//1ro revisamos que el usuario este autenticado con el Middleware que verifica que el usuario este autenticado, validando el Token si pertenece al proyecto
    proyectoController.obtenerProyectos//Llama a la funcion "obtenerProyectos" del controlador "proyectoController"
);

/**
 * Middleware para el endpoint "api/proyectos" que atendera al verbo PUT de HTTP.
 * Que apunta a la funcion "actualizarProyecto" del controlador "proyectoController", para actualizar un proyecto perteneciente a un usuario que este autenticado.
 * Recibe un REQUEST de tipo PUT hacia la URL "api/proyectos". Ruta local del endpoint: http://localhost:4000/api/proyectos
 * Cuando hagamos un PUT hacia esta API "api/proyectos", API definida en el archivo "servidor-back-eng/index.js".
 * Al poner aqui solo la diagonal '/' esto indicara que sera "api/proyectos", ":id" es un parametro que debe ser enviado en la URL del endpoint.
 */
router.put('/:id',
    auth,//1ro revisamos que el usuario este autenticado con el Middleware que verifica que el usuario este autenticado, validando el Token si pertenece al proyecto
    [   //Agregando las "REGLAS DE VALIDACIÓN": Campo a validar, Cual va a ser su mensaje de error y que reglas van a plicar
        check('nombre', 'El nombre del proyecto es obligatorio').not().isEmpty()//Revisa que el campo nombre NO este VACIO
    ],
    proyectoController.actualizarProyecto//Llama a la funcion "actualizarProyecto" del controlador "proyectoController"
);

/**
 * Middleware para el endpoint "api/proyectos" que atendera al verbo DELETE de HTTP.
 * Que apunta a la funcion "eliminarProyecto" del controlador "proyectoController", para eliminar un proyecto perteneciente a un usuario que este autenticado.
 * Recibe un REQUEST de tipo DELETE hacia la URL "api/proyectos". Ruta local del endpoint: http://localhost:4000/api/proyectos
 * Cuando hagamos un DELETE hacia esta API "api/proyectos", API definida en el archivo "servidor-back-eng/index.js".
 * Al poner aqui solo la diagonal '/' esto indicara que sera "api/proyectos", ":id" es un parametro que debe ser enviado en la URL del endpoint.
 */
router.delete('/:id',
    auth,//1ro revisamos que el usuario este autenticado con el Middleware que verifica que el usuario este autenticado, validando el Token si pertenece al proyecto
    proyectoController.eliminarProyecto//Llama a la funcion "eliminarProyecto" del controlador "proyectoController"
);

module.exports = router;