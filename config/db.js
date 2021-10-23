const mongoose = require('mongoose');//importar mongoose para la conexion, el ORM de la capa que realizara las consultas

//Requerimos el string de conexion a la BD, por lo que la dependencia 'dotenv' nos permitira leer el archivo "variables.env".
//Las variables de entorno van a ser diferentes tanto las locales ó de desarrollo, como las de producción.
require('dotenv').config({ path: 'variables.env' });

const conectarDB = async () => {
    try {
        //El metodo connect de mongosse, requiere 2 parametros, el 1ero la URL a donde se va a conectar
        //y como 2do parametro un objeto de configuración.
        //Gracias a 'dotenv' podemos usar process.env.NOMBRE_VARIABE_ENTORNO
        await mongoose.connect(process.env.DB_MONGO, {
            useCreateIndex: true,//linea agregada para quitar el mensaje en consola: DeprecationWarning: collection.ensureIndex is deprecated
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false
        });
        console.log('DB conectada');
    } catch (error) {
        console.log(error);
        process.exit(1);//En caso de que haya un error en la conexión, detener la app
    }
}

module.exports = conectarDB;//Para hacerla dsponible en mis otros archivos