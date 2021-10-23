//Rutas para autenticar usuarios
const express = require('express');//Importar express
const router = express.Router();
const authController = require('../controllers/authController');//Importar controlador "authController.js"

//Para agregar "REGLAS DE VALIDACIÓN" se usa la funcion "check" de la dependencia "express-validator".
//se instala la dependencia "express-validator", dentro de nuestro "servidor-back-end" con el siguiente comando:
//   npm i express-validator
const { check } = require('express-validator');//Importamos la funcion "check" de la dependencia "express-validator"

const auth = require('../middleware/auth');//Importar middleware "auth.js" para la autenticación del usuario

/**
 * Middleware para "api/auth" que va a recibir un metodo POST. INICIAR SESION y su endpoint sera "api/auth".
 * Recibe un request de tipo POST hacia esta URL "api/auth". Ruta local del endpoint: http://localhost:4000/api/auth
 * Cuando hagamos un "post" hacia esta API "api/auth", por que es lo que definimos en el archivo "servidor-back-eng/index.js"
 * al poner aqui solo la diagonal '/' y esto indicara que sera "api/auth"
 * Cuando enviemos un POST hacia "api/auth", se va a ejecutar el siguiente código
 */
router.post('/',
/*     [   //Campo a validar, Cual va a ser su mensaje de error, y que reglas van a plicar
        check('email', 'Agrega un email valido').isEmail(),//Revisa que sea un email valido
        check('password', 'El password debe de ser minimo de 6 caracteres').isLength({ min: 6 })//Password tenga como minimo una longitud de 6 caracteres
    ], */
    authController.autenticarUsuario//Se llama a la funcion "autenticarUsuario" del controlador "authController"
);

/**
 * Middleware para "api/auth" que va a recibir un metodo GET. Obtener el usuario autenticado y su endpoint sera "api/auth".
 * Recibe un request de tipo GET hacia esta URL "api/auth". Ruta local del endpoint: http://localhost:4000/api/auth
 * Cuando hagamos un "get" hacia esta API "api/auth", por que es lo que definimos en el archivo "servidor-back-eng/index.js"
 * al poner aqui solo la diagonal '/' y esto indicara que sera "api/auth"
 * Cuando enviemos un GET hacia "api/auth", se va a ejecutar el siguiente código
 */
router.get('/',
    auth,//middleware que verifica que el usuario este autenticado validando el Token si pertenece a este proyecto
    authController.usuarioAutenticado//Se llama a la funcion "usuarioAutenticado" del controlador "authController"
);

module.exports = router;//Exportamos el "router" y va a estar disponible en "servidor-back-eng/index.js"