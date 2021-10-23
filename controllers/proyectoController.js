const Proyecto = require('../models/Proyecto');//Importar model "Proyecto.js"
const Tarea = require('../models/Tarea');//Importar model "Tarea.js"

//Para revisar los mensajes de las "REGLAS DE VALIDACIÓN" que con "express-validator" definimos con la funcion "check()".
//Con "validationResult", obtenemos los errores en caso de existir que fueron definidos en "routes/proyectos.js"
//se instala la dependencia "express-validator", dentro de nuestro "servidor-back-end" con el siguiente comando:
//   npm i express-validator
const { validationResult } = require('express-validator');//Importar la funcion "validationResult" de 'express-validator'

/**
 * Crea un proyecto nuevo que le correspondera al usuario que este autenticado. Atiende el verbo POST de HTTP hacia "api/proyectos".
 * Lo que el usuario nos mande, esa información va a ser parte de algo que se conoce como el REQUEST.
 * El REQUEST es lo que el usuario envia. Aqui en donde llega la petición de que se cree un proyecto.
 * @param {*} req request peticion solicitada
 * @param {*} res response respuesta a la peticion
 */
exports.crearProyecto = async (req, res) => {
    //Revisar si hay errores definidos en "routes/proyectos.js" con la funcion "check()"
    //Revisa si hay errores en el REQUEST al intentar agregar un proyecto con las validaciones definidas en "routes/proyectos.js"
    const errores = validationResult(req);//Revisa haya errores, si los hay se genera una arreglo de errores
    if( !errores.isEmpty() ){//En caso de que "validationResult()" detecte errores respecto a las validaciones definidas
        return res.status(400).json({ errores: errores.array() });
    }

    try {
        //Crear un nuevo Proyecto, para esto se instancia un objeto del modelo "Proyecto.js"
        //ya que este contiene la estructura de los campos definidos en la BD para crear un proyecto.
        const proyecto = new Proyecto(req.body);

        //Guardar en el campo "creador" de la coleccion "proyectos" de la BD via JSON Web Token, el "usuario.id" del REQUEST
        proyecto.creador = req.usuario.id;//En nuestro "middleware\auth.js" se esta guardando en "req.usuario", pero en "usuarioController" en el payload guardamos "usuario" pero ahi tenemos el "id"

        //Guardar nuevo proyecto, dado que en la funcion usamos "async", al guardar el proyecto usaremos "await"
        await proyecto.save();//usamos la instancia "proyecto" con el metodo "save()" para guardar en la coleccion "proyectos" de la BD

        res.json(proyecto);
    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error en el servidor');
    }
}

/**
 * Obtiene los todos proyectos creados por el usuario que este autenticado. Atiende el verbo GET de HTTP hacia "api/proyectos".
 * @param {*} req request peticion solicitada
 * @param {*} res response respuesta a la peticion
 */
exports.obtenerProyectos = async (req, res) => {
    try {
        //console.log(req.usuario);
        //Buscar todos los proyectos de un usuario cuyo "usuario.id" conincida con el campo "creador" de la coleccion "proyectos" en la BD
        const proyectos = await Proyecto.find({ creador: req.usuario.id }).sort({ creado: -1 });//sort() cambia el orden respecto al campo "creado" donde su fecha sea más actual sera el primero en la lista a mostrar
        res.json({ proyectos });//Cuando llave y valor se llaman igual en un JSON como "proyectos: proyectos" puede ponerse solo uno de ellos
    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error al obtener el listado de los proyectos');
    }
}

/**
 * Actualiza un proyecto perteneciente a un usuario que este autenticado. Atiende el verbo PUT de HTTP hacia "api/proyectos".
 * @param {*} req request peticion solicitada
 * @param {*} res response respuesta a la peticion
 */
exports.actualizarProyecto = async (req, res) => {
    //Revisar si hay errores definidos en "routes/proyectos.js" con la funcion "check()"
    //Revisa si hay errores en el REQUEST al intentar agregar un proyecto con las validaciones definidas en "routes/proyectos.js"
    const errores = validationResult(req);//Revisa haya errores, si los hay se genera una arreglo de errores
    if( !errores.isEmpty() ){//En caso de que "validationResult()" detecte errores respecto a las validaciones definidas
        return res.status(400).json({ errores: errores.array() });
    }
    
    //Extraer "nombre" usando destructuring, información del proyecto contenida en el REQUEST
    const { nombre } = req.body;

    const nuevoProyecto = {};//nuevoProyecto que va a reeiscribir y contendra el proyecto a actualizar

    if(nombre){//Si el usuario esta pasando un nombre
        nuevoProyecto.nombre = nombre;
    }

    try{
        //Revisar el id del proyecto "req.params.id" que solicita actualizar el usuario autenticado
        await Proyecto.findById(req.params.id, (err, proyecto) => {//Busca en la coleccion "proyectos" de la BD por el ID del proyecto 
            //Revisar si el proyecto existe o no
            if (err || !proyecto) {
                return res.status(404).json({
                    msg: 'Proyecto de usuario no encontrado'
                });
            }
 
            //Verificar el creador del proyecto, tiene que ser la misma persona que este autenticada
            if (proyecto.creador.toString() !== req.usuario.id) {
                return res.status(401).json({
                    msg: 'Usuario No Autorizado'
                });
            }
        });

        //Actualizar el proyecto, por el campo "_id" de la coleccion "proyectos" de la BD
        proyecto = await Proyecto.findByIdAndUpdate({ _id: req.params.id }, { $set: nuevoProyecto }, { new: true });
        res.json({proyecto});
    } catch(error) {
        console.log(error);
        res.status(500).send('Error en el servidor');
    }
}

/**
 * Elimina un proyecto por su Id de un usuario que este autenticado. Atiende el verbo DELETE de HTTP hacia "api/proyectos".
 * @param {*} req request peticion solicitada
 * @param {*} res response respuesta a la peticion
 */
exports.eliminarProyecto = async (req, res) => {
    try {
        //Revisar el id del proyecto "req.params.id" que desea eliminar el usuario autenticado
        await Proyecto.findById(req.params.id, (err, proyecto) => {//Busca en la coleccion "proyectos" de la BD por el ID del proyecto 
            //Revisar si el proyecto existe o no
            if (err || !proyecto) {
                return res.status(404).json({
                    msg: 'Proyecto de usuario a eliminar no encontrado'
                });
            }
 
            //Verificar el creador del proyecto, tiene que ser la misma persona que este autenticada
            if (proyecto.creador.toString() !== req.usuario.id) {
                return res.status(401).json({
                    msg: 'Usuario No Autorizado'
                });
            }
        });

        //1ero, Eliminar todas las tareas cuyo campo "proyecto" que es el ID del Proyecto de la coleccion "tareas"
        await Tarea.deleteMany({ proyecto: req.params.id });

        //2do, Eliminar el proyecto de la colección "proyectos" cuyo campo "_id" corresponda al ID del proyecto "req.params.id"
        await Proyecto.findOneAndRemove({ _id: req.params.id });
        res.json({ msg: 'Proyecto Eliminado' });
    } catch (error) {
        console.log(error);
        res.status(500).send('Error en el servidor');
    }
}
