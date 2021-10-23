const mongoose = require('mongoose');//Importar mongoose requerido para crear el Schema

/**
 * Definiendo el modelo de "Tarea" con mongoose. El modelo va a dar la estructura que va a tener la colección en la BD.
 * Schema donde se definen los campos que va a tener el modelo de "Tarea".
 */
const TareaSchema = mongoose.Schema({
    nombre: {
        type: String,
        required: true,//Es obligatorio, esto nos permite validar con "express-validator"
        trim: true//Elimina los espacios en blanco al inicio y al final
    },
    estado: {//true => Completa, false => incompleta
        type: Boolean,
        default: false//Cuando se cree una tarea va a estar como false = incompleta
    },
    creado: {//Fecha en la que fue creado
        type: Date,
        default: Date//El método .now() ignora los segundos en un listado cuando quieres ordenar por fecha de creado. Si ponemos "Date" a secas en el model sin el método "now()" el valor de la fecha es mas amigable y tiene en cuenta los segundos.
    },
    proyecto: {
        type: mongoose.Schema.Types.ObjectId,//Cada "proyecto" tiene su propio ID creada por Mongo, esta sera la referencia de en que "proyecto" se creo la tarea
        ref: 'Proyecto'//Nombre del modelo registrado en el archivo "servidor-back-end\models\Proyecto.js" y que sirve como referencia para el "ObjectId" que se le esta pasando
    }
});

//Registrar el modelo "Tarea" con el Schema "TareaSchema", esto creara la coleccion "tareas" en plural todo en minisculas en la BD de MongoDB
module.exports = mongoose.model('Tarea', TareaSchema);