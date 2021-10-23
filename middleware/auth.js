//Se instalo dentro de la ruta de "servidor-back-end" la dependencia "jsonwebtoken".
//Esta dependencia permitira generar un "JSON Web Token" cuando creemos un nuevo usuario.
//Tambien nos va a permitir crear el "JSON Web Token" cuando la autenticación sea correcta.
//Para instalar la dependencia ejecutar el siguiente comando:   npm install jsonwebtoken
const jwt = require('jsonwebtoken');//Importar la libreria "jsonwebtoken"

/**
 * Middleware "auth.js" que verifica que el usuario este autenticado validando el Token si pertenece a este proyecto.
 * Cada que se envie una petición (verbos HTTP) POST, GET, PUT o DELETE hacia proyectos verificar que el usuario este autenticado.
 * @param {*} req request peticion solicitada
 * @param {*} res response respuesta a la peticion
 * @param {*} next siguiente middleware
 * @returns 
 */
module.exports = function(req, res, next){
    //Leer el token del header
    const token = req.header('x-auth-token');//lo que tiene 'x-auth-token' es que en cada REQUEST se tiene que enviar
    //console.log(token);

    //Revisar que haya un Token, si el usuario no envia ningun Token retornar el siguiente mensaje
    if(!token){//Tiene que estar presente ese Token en el Header
        return res.status(401).json({ msg: 'No hay Token, permiso no valido' });
    }

    //Finalmente Validar el token si pertenece a este proyecto, haciendo uso del metodo "verify()" de la libreria "jsonwebtoken"
    try {
        const cifrado = jwt.verify(token, process.env.SECRETA);//Token verificado, pasandole el token a verificar y la palabra secreta

        //En caso de haya verificado bien el metodo "verify()", agregar al REQUEST el "usuario" que contiene la verificacion del Token
        //Cuando se agrega un nuevo usuario en "usuarioController.js" en el "payload" se le pasa "usuario"
        req.usuario = cifrado.usuario;//Con esto ya podemos acceder al ID del usuario que ha sido verificado

        next();//Para que valla al siguiente middleware, donde es llamado este middleware es en "servidor-back-end\routes\proyectos.js"
    } catch (error) {//En caso de que haya un error con el Token que no sea valido
        res.status(401).json({ msg: 'Token no valido' });//Tal vez manda un token, tal vez ya expiro
    }
}