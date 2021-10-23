//Las "Tareas" pertenecen a los "Proyectos" por lo tanto seran necesarios los models de "Tarea.js" y "Proyecto.js"
//Por que antes de insertar una tarea tenemos que asegurarnos de que ese Proyecto exista
const Tarea = require('../models/Tarea');//Importar model "Tarea.js"
const Proyecto = require('../models/Proyecto');//Importar model "Proyecto.js"

//Para revisar los mensajes de las "REGLAS DE VALIDACIÓN" que con "express-validator" definimos con la funcion "check()"
//definidos en "routes/tareas.js", con "validationResult()" validamos y obtenemos los errores de validación en caso de existir.
//se instala la dependencia "express-validator", dentro de nuestro "servidor-back-end" con el siguiente comando:
//   npm i express-validator
const { validationResult } = require('express-validator');//Importar la funcion "validationResult" de 'express-validator'

/**
 * Crea una nueva Tarea que se le asignara a un Proyecto ya creado y validado que exista, perteneciente al usuario que este autenticado.
 * Atiende el verbo POST de HTTP hacia "api/tareas".
 * @param {*} req request peticion solicitada
 * @param {*} res response respuesta a la peticion
 */
exports.crearTarea = async (req, res) => {
    //Revisar si hay errores definidos en "routes/tareas.js" con la funcion "check()"
    //Revisa si hay errores en el REQUEST al intentar agregar una tarea, respecto a las validaciones definidas en "routes/tareas.js"
    const errores = validationResult(req);//si los hay se genera una arreglo de errores
    if( !errores.isEmpty() ){//En caso de que se haya generado el arreglo de errores
        return res.status(400).json({ errores: errores.array() });
    }
    
    try {
        //Extraer el "proyecto" al REQUEST usando destructuring, "proyecto" contiene el ID del proyecto
        //Aqui el REQUEST contiene "nombre" de la tarea y "proyecto" que es el ID del proyecto, para la creacion de una nueva tarea
        const { proyecto } = req.body;

        //Revisar por el ID del proyecto que exista en la colección "proyectos" de la BD
        const existeProyecto = await Proyecto.findById(proyecto);

        if (!existeProyecto) {//Si No EXISTE el proyecto
            return res.status(404).json({ msg: 'Proyecto no encontrado para asignar la tarea' });
        }

        //Si el "creador" del proyecto de la BD, NO es IGUAL al usuario autenticado "req.usuario.id" (que es la sesion de usuario)
        if (existeProyecto.creador.toString() !== req.usuario.id) {
            return res.status(401).json({
                msg: 'Usuario No Autorizado'
            });
        }

        //Se instancia un objeto del modelo "Tarea.js" ya que este contiene la estructura de los campos definidos 
        //en la coleccion de la BD para crear un proyecto, pasandole el REQUEST que contiene "nombre" y "proyecto"
        const tarea = new Tarea(req.body);

        //Se Crea la nueva tarea en la coleccion "tareas" de la BD
        await tarea.save();
        res.json({ tarea });
    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error al crear la tarea');
    }
}

/**
 * Obtiene la lista de tareas por proyecto de un usuario autenticado. Atiende el verbo GET de HTTP hacia "api/tareas".
 * @param {*} req request peticion solicitada
 * @param {*} res response respuesta a la peticion
 */
exports.obtenerTareas = async (req, res) => {
    try {
        //Extraer el "proyecto" al REQUEST usando destructuring, "proyecto" contiene el ID del proyecto
        //Aqui el REQUEST contiene "nombre" y "proyecto" para la creacion de una nueva tarea
        const { proyecto } = req.query;//usamos req.query por que usa "params" en la peticion de tipo GET

        //Revisar por el ID del proyecto que exista en la colección "proyectos" de la BD
        const existeProyecto = await Proyecto.findById(proyecto);

        if (!existeProyecto) {//Si No EXISTE el proyecto
            return res.status(404).json({ msg: 'Proyecto no encontrado' });
        }

        //Si el "creador" del proyecto de la BD, NO es IGUAL al usuario autenticado "req.usuario.id" (que es la sesion de usuario)
        if (existeProyecto.creador.toString() !== req.usuario.id) {
            return res.status(401).json({
                msg: 'Usuario No Autorizado'
            });
        }

        //Obtener por el ID de proyecto las tareas que se encuentren en la colección "tareas" de la BD
        const tareas = await Tarea.find({ proyecto }).sort({ creado: -1 });//-1 cambia el orden a las tareas ultimas o recientes creadas primero a ser mostradas
        res.json({tareas});
    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error al obtener el listado de tareas');
    }
}

/**
 * Actualiza una tarea, permitiendo actualizar el nombre de una tarea asi como cambiar el estado de una tarea de
 * incompleta a incompleta, perteneceiente a un proyecto de un usuario autenticado. Atiende el verbo PUT de HTTP hacia "api/tareas".
 * @param {*} req request peticion solicitada
 * @param {*} res response respuesta a la peticion
 */
exports.actualizarTarea = async (req, res) => {
    try {
        //Extraer "proyecto", "nombre" y "estado" al REQUEST usando destructuring, "proyecto" contiene el ID del proyecto.
        //Aqui el REQUEST contiene "nombre", "proyecto" y "estado" requerido para la actualización de una tarea.
        const { proyecto, nombre, estado } = req.body;

        //Revisar que exista la tarea, buscando por el ID de la tarea en la colección "tareas" de la BD
        //"req.params.id" es el ":id" agregado en la ruta que escucha en PUT e indica que se le pasara un ID en el enpoint http://localhost:4000/api/tareas
        const existeTarea = await Tarea.findById(req.params.id);

        if(!existeTarea){//Si no existe la tarea
            return res.status(404).json({ msg: 'Tarea no existe' });
        }

        //Revisar en la colección "proyectos" de la BD, que exista el proyecto por el ID del proyecto 
        const existeProyecto = await Proyecto.findById(proyecto);

        //Si el "creador" del proyecto de la BD, NO es IGUAL al usuario autenticado "req.usuario.id" (que es la sesion de usuario)
        //La persona que esta editando el proyecto le pertenezca 
        if (existeProyecto.creador.toString() !== req.usuario.id) {
            return res.status(401).json({
                msg: 'Usuario No Autorizado'
            });
        }
        
        //Crear un objeto que albergara la nueva información a actualizar de la tarea
        const nuevaTarea = {};
        nuevaTarea.nombre = nombre; //Si el usuario decide cambiar el "nombre" se obtendra del REQUEST en caso de que el usuario lo mande
        nuevaTarea.estado = estado; //Si el usuario decide cambiar el "estado" se obtendra del REQUEST en caso de que el usuario lo mande

        //Guardar la tarea
        tareaActualizada = await Tarea.findOneAndUpdate({ _id: req.params.id }, nuevaTarea, { new: true });
        res.json({ tareaActualizada });
    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error al actualizar la tarea');
    }
}

/**
 * Elimina una tarea perteneceiente a un proyecto de un usuario autenticado. Atiende el verbo DELETE de HTTP hacia "api/tareas".
 * @param {*} req request peticion solicitada
 * @param {*} res response respuesta a la peticion
 */
exports.eliminarTarea = async (req, res) => {
    try {
        //Extraer "proyecto" al REQUEST usando destructuring, "proyecto" contiene ID del proyecto al que pertenece la tarea.
        //const { proyecto } = req.body;
        const { proyecto } = req.query;//usamos "req.query" por que usa "params" en la peticion de tipo DELETE desde "cliente-front-end"

        //Revisar que exista la tarea, buscando por el ID de la tarea en la colección "tareas" de la BD
        //"req.params.id" es el ":id" agregado en la ruta que escucha el DELETE e indica que se le pasara un ID en el enpoint http://localhost:4000/api/tareas
        const existeTarea = await Tarea.findById(req.params.id);

        if(!existeTarea){//Si no existe la tarea
            return res.status(404).json({ msg: 'Tarea a eliminar no existe' });
        }

        //Revisar en la colección "proyectos" de la BD, que exista el proyecto por el ID del proyecto 
        const existeProyecto = await Proyecto.findById(proyecto);

        if (!existeProyecto) {//Si No EXISTE el proyecto
            return res.status(404).json({ msg: 'Proyecto no encontrado' });
        }

        //Si el "creador" del proyecto de la BD, NO es IGUAL al usuario autenticado "req.usuario.id" (que es la sesion de usuario)
        //La persona que esta editando el proyecto le pertenezca 
        if (existeProyecto.creador.toString() !== req.usuario.id) {
            return res.status(401).json({
                msg: 'Usuario No Autorizado'
            });
        }
 
        //Eliminar la tarea enviada como parametro en la URL del endpoint de "http://localhost:4000/api/tareas/" en la coleccion "tareas" de la BD.
        await Tarea.findOneAndRemove({ _id: req.params.id });
        res.json({ msg: 'Tarea Eliminada perteneciente al proyecto: ' + existeProyecto.nombre });
    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error al eliminar la tarea');
    }
}