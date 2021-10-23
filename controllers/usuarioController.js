const Usuario = require('../models/Usuario');//Importar model "Usuario.js"

//Se instalo dentro de la ruta de "servidor-back-end" la dependencia "bcryptjs" que sera usada para hashear el password,
//por lo que en la consola ejecutar lo siguiente:   npm install bcryptjs
const bcryptjs = require('bcryptjs');//Importar la libreria "bcryptjs"

//Para revisar los mensajes de las "REGLAS DE VALIDACIÓN" que con "express-validator" definimos con la funcion "check()".
//Con "validationResult", obtenemos los errores en caso de existir que fueron definidos en "routes/proyectos.js"
//se instala la dependencia "express-validator", dentro de nuestro "servidor-back-end" con el siguiente comando:
//   npm i express-validator
const { validationResult } = require('express-validator');//Importar la funcion "validationResult" de 'express-validator'

//Se instalo dentro de la ruta de "servidor-back-end" la dependencia "jsonwebtoken".
//Esta nos va a permitir generar un JSON Web Token cuando creemos un nuevo usuario.
//Y tambien nos va a permitir crear el JSON Web Token cuando la autenticación sea correcta.
//Para instalarlo ejecutar el siguiente comando:   npm install jsonwebtoken
const jwt = require('jsonwebtoken');//Importar la libreria "jsonwebtoken"

/**
 * Crea un usuario nuevo. Atiende el verbo POST de HTTP hacia el endpoint "api/usuarios".
 * Lo que el usuario nos mande, esa información va a ser parte de algo que se conoce como el REQUEST.
 * El REQUEST es lo que el usuario envia. Aqui en donde llega la petición de que se cree un usuario.
 * @param {*} req request peticion solicitada
 * @param {*} res response respuesta a la peticion
 */
exports.crearUsuario = async (req, res) => {
    //Revisar si hay errores definidos en "routes/usuarios.js" con la funcion "check()"
    //Revisa si hay errores en el REQUEST al intentar agregar un usuario con las validaciones definidas en "routes/usuarios.js"
    const errores = validationResult(req);//Revisa haya errores, si los hay se genera una arreglo de errores
    if( !errores.isEmpty() ){//En caso de que validationResult detecte errores respecto a las validaciones definidas
        return res.status(400).json({ errores: errores.array() });
    }

    //extraer "email" y "password" usando destructuring a "req.body"
    const { email, password } = req.body;

    //console.log(req.body);
    try {
        //Revisar que el usuario registrado sea unico, se definio como "unique" al "email" en el model "Usuario.js"
        let usuario = await Usuario.findOne({email});//Busca si hay un usuario con el email enviado, en la BD

        //Si existe un usuario previo con el email enviado en la petición
        if (usuario) {
            return res.status(400).json({ msg: 'El usuario ya existe' });
        }

        //Crea el nuevo usuario para esto se instancia un objeto del modelo "Usuario.js"
        //ya que este contiene la estructura de los campos definidos en la BD para crear un usuario.
        usuario = new Usuario(req.body);//Con "req.body" podemos acceder a los valores enviado desde POST

        //Hashear el password, para esto lo 1ero es crear un salt. un salt nos va a generar un hash unico.
        //Esto es por si dos ó mas usuario escriben el mismo password, el salt agregado al password dara un resultado diferente
        //aunque estos usuarios escriban el mismo password.
        const salt = await bcryptjs.genSalt(10);//Generar el salt
        usuario.password = await bcryptjs.hash(password, salt);//reescribir password agregandole un hash, 1er parametro string a hashear, 2do parametro el salt

        //Guardar nuevo usuario, dado que en la funcion usamos "async", al guardar el usuario usaremos "await"
        await usuario.save();//usamos la instancia "usuario" con el metodo "save()" para guardar en la BD

        //Para CREAR y FIRMAR el JSON WEB TOKEN (JWT). Consistiria en 2 partes.
        //1ero crear el JWT con el PAYLOAD con cierta información que se va a almacenar en ese JWT        
        const payload = {//Información que va a guardar en el JWT
            usuario: {
                id: usuario.id//Se guarda el ID del usuario que se esta guardando en:   await usuario.save();
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
            //res.json({ msg: 'Usuario creado correctamente' });
            //res.send('Usuario creado correctamente');
        });
        
    } catch (error) {
        console.log(error);
        res.status(400).send('Hubo un error al guardar el usuario');
    }
}