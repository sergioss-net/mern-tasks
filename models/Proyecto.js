const mongoose = require('mongoose');//Importar mongoose requerido para crear el Schema

/**
 * Definiendo el modelo de Proyecto con mongoose. El modelo va a dar la estructura que va a tener la colección en la BD.
 * Schema donde se definen los campos que va a tener el modelo de Proyecto.
 */
const ProyectoSchema = mongoose.Schema({
    nombre: {
        type: String,
        required: true,//Es obligatorio, esto nos permite validar con "express-validator"
        trim: true//Elimina los espacios en blanco al inicio y al final
    },
    creador: {
        type: mongoose.Schema.Types.ObjectId,//Cada usuario tiene su propio ID creada por Mongo, esta sera la referencia de que usuario creo el proyecto
        ref: 'Usuario'//Nombre del modelo registrado en el archivo "servidor-back-end\models\Usuario.js" y que sirve como referencia para el "ObjectId" que se le esta pasando
    },
    creado: {
        type: Date,
        default: Date//El método .now() ignora los segundos por eso se repite. Si ponemos "Date" a secas en el model sin el método "now()" el valor de la fecha es mas amigable y tiene en cuenta los segundos.
        //default: Date.now()//Una vez que se genere el registro, se generara una fecha al momento en que se hace el registro o fue dada de alta
    }
});

//Registrar el modelo "Proyecto" con el Schema "ProyectoSchema", esto creara la coleccion "proyectos" en plural todo en minisculas en la BD de MongoDB
module.exports = mongoose.model('Proyecto', ProyectoSchema);