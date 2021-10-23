//Rutas para crear usuarios
const express = require('express');//Importar express
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');//Importar controlador "usuarioController.js"

//Para agregar "REGLAS DE VALIDACIÓN" se usa la funcion "check" de la dependencia "express-validator".
//se instala la dependencia "express-validator", dentro de nuestro "servidor-back-end" con el siguiente comando:
//   npm i express-validator
const { check } = require('express-validator');//Importamos la funcion "check" de la dependencia "express-validator"

/**
 * Middleware para "api/usuarios" que va a recibir un metodo POST. Crea usuario y su endpoint sera "api/usuarios".
 * Recibe un request de tipo POST hacia esta URL "api/usuarios". Ruta local del endpoint: http://localhost:4000/api/usuarios
 * Cuando hagamos un "post" hacia esta API "api/usuarios", por que es lo que definimos en el archivo "servidor-back-eng/index.js"
 * al poner aqui solo la diagonal '/' esto indica que esta apuntando a "api/usuarios"
 * Cuando enviemos un post hacia "api/usuarios", se va a ejecutar el siguiente código
 */
router.post('/',
    [   //Agregando las "REGLAS DE VALIDACIÓN": Campo a validar, Cual va a ser su mensaje de error y que reglas van a plicar
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),//Revisa que el campo nombre NO este VACIO
        check('email', 'Agrega un email valido').isEmail(),//Revisa que sea un email valido
        check('password', 'El password debe de ser minimo de 6 caracteres').isLength({ min: 6 })
    ],
    usuarioController.crearUsuario//Se llama a la funcion "crearUsuario" del controlador "usuarioController"
);
module.exports = router;//Exportamos el "router" y va a estar disponible en "servidor-back-eng/index.js"