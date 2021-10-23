const mongoose = require('mongoose');//Importar mongoose requerido para crear el Schema

/**
 * Definiendo el modelo de Usuario con mongoose. El modelo va a dar la estructura que va a tener la colección en la BD.
 * Schema donde se definen los campos que va a tener el modelo de Usuario.
 */
const UsuariosSchema = mongoose.Schema({
    nombre: {
        type: String,
        required: true,//Es obligatorio, esto nos permite validar con "express-validator"
        trim: true//Elimina los espacios en blanco al inicio y al final
    },
    email: {
        type: String,
        required: true,//Es obligatorio, esto nos permite validar con "express-validator"
        trim: true,//Elimina los espacios en blanco al inicio y al final
        unique: true//El email es unico, esto es no se permitira tener 2 correos iguales y validarlo con "express-validator"
    },
    password: {
        type: String,
        required: true,//Es obligatorio, esto nos permite validar con "express-validator"
        trim: true//Elimina los espacios en blanco al inicio y al final
    },
    registro: {
        type: Date,
        default: Date.now()//Una vez que se genere el registro, se generara una fecha al momento en que se hace el registro
    }
});

//Registrar el modelo "Usuario" con el Schema "UsuariosSchema", esto creara la coleccion "usuarios" en plural todo en minisculas en la BD de MongoDB
module.exports = mongoose.model('Usuario', UsuariosSchema);