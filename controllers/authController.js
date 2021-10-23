const Usuario = require('../models/Usuario');//Importar model "Usuario.js"

//Se instalo dentro de la ruta de "servidor-back-end" la dependencia "bcryptjs" que sera usada para hashear el password,
//por lo que en la consola ejecutar lo siguiente:   npm install bcryptjs
const bcryptjs = require('bcryptjs');//Importar la libreria "bcryptjs"

//Resultado de la Validación con "express-validator"
//Con "validationResult", se muestran los errores en caso de existir que fueron definidos en "routes/auth.js"
//se instala la dependencia "express-validator", dentro de nuestro "servidor-back-end" con el siguiente comando:
//   npm i express-validator
const { validationResult } = require('express-validator');//Importa la funcion "validationResult" de la dependencia 'express-validator'

//Se instalo dentro de la ruta de "servidor-back-end" la dependencia "jsonwebtoken".
//Esta nos va a permitir generar un JSON Web Token cuando creemos un nuevo usuario.
//Y tambien nos va a permitir crear el JSON Web Token cuando la autenticación sea correcta.
//Para instalarlo ejecutar el siguiente comando:   npm install jsonwebtoken
const jwt = require('jsonwebtoken');//Importar la libreria "jsonwebtoken"

/**
 * Aqui en donde llega la petición de que se autentique al usuario. El REQUEST es lo que el usuario envia.
 * Lo que el usuario nos mande, esa información va a ser parte de algo que se conoce como el REQUEST.
 * @param {*} req request peticion solicitada
 * @param {*} res response respuesta a la peticion
 */
exports.autenticarUsuario = async (req, res) => {
    //Revisa si hay errores en el REQUEST al autenticar un usuario con las reglas de validación definidas en "routes/auth.js"
    const errores = validationResult(req);//genera una arreglo de errores
    if( !errores.isEmpty() ){//En caso de que validationResult detecte errores respecto a las validaciones definidas
        return res.status(400).json({ errores: errores.array() });
    }

    //Extraer el email y el password del REQUEST
    const { email, password } = req.body;
 
    try {
        //Revisar que sea una usuario registrado, por que va a iniciar sesión con su email por lo que se revisara que haya un usuario que tenga ese mail.
        let usuario = await Usuario.findOne({ email });//Buscar un usuario en la BD que conincida con el email enviado por REQUEST
        if(!usuario){//Si ese usuario No EXISTE
            return res.status(400).json({ msg: 'El usuario no existe' });
        }

        //SI EXISTE el Usuario revisar el password, comparando el password que se envia por REQUEST, con el password que esta en la BD.
        const passCorrecto = await bcryptjs.compare(password, usuario.password);//Usamos el metodo "compare()" de "bcryptjs"
        if(!passCorrecto){//Validamos, Si el password es INCORRECTO
            return res.status(400).json({ msg: 'Password Incorrecto' });
        }

        //Si todo es correcto toca CREAR y FIRMAR el JSON Web Token (JWT). El cual consiste en 2 partes.
        //1ero crear el JWT con el PAYLOAD con cierta información que se va a almacenar en ese JWT        
        const payload = {//Información que va a guardar en el JSON Web Token
            usuario: {
                id: usuario.id//Se guarda el ID del usuario
            }
        };
        //2do consiste en firmar al JSON Web Token
        //Es importarte que la palabra secreta sea la misma para firmar el TOKEN cuando el usuario es creado, como para autenticar el usuario.
        jwt.sign(payload, process.env.SECRETA, {//Confiduración de la FIRMA del token
            expiresIn: 3600 //3600 segundos = 1 HORA
        }, (error, token) => {//Revisar si hay un ERROR al crear el TOKEN
            if(error) throw error;//Para que marque un error y deje de ejecutarse

            //Mensaje de confirmacion si se creo y guardo el usuario correctamente
            res.json({ token })//Cuando llave y valor se llaman igual en un JSON como "token: token" puede ponerse solo uno de ellos
        });

        
    } catch (error) {
        console.log(error);
    }
}

/**
 * Obtiene que usuario esta autenticado. El REQUEST es lo que el usuario envia.
 * Lo que el usuario nos mande, esa información va a ser parte de algo que se conoce como el REQUEST.
 * @param {*} req request peticion solicitada
 * @param {*} res response respuesta a la peticion
 */
exports.usuarioAutenticado = async (req, res) => {
    try {
        //Buscar por el ID del usuario, el registro del usuario en la coleccion "usuarios" de la BD
        const usuario = await Usuario.findById(req.usuario.id).select('-password');//requiero todos los campos de la coleccion "usuarios" excepto el campo "password"
        res.json({usuario});
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'Hubo un error al obtener usuario autenticado' })
    }
}