const express = require('express');
var cors = require('cors');
const { dbConnection } = require('../database/configDB.js');
const fileUpload = require('express-fileupload');

class Server {
    
    constructor(){
        //propiedades de nuestra clase
        this.app = express();
        this.port = process.env.PORT;

        this.paths = {
            auth: '/api/auth',
            usuario: '/api/usuarios',
            productos: '/api/productos',
            categorias: '/api/categorias',
            buscar: '/api/buscar',
            uploads: '/api/uploads',
        }

        //conectar a BD
        this.conectarDB();

        //Middlewares
        this.middlewares();
        //llamamos al metodo rutas para inicializarlas
        this.routes();
    }

    async conectarDB() {
        await dbConnection();
    }

    middlewares(){
        // con app.use indicamos que lo siguiente es un middleware
        
        //CORS
        this.app.use( cors() );
        
        //parseo y lectura del body
        this.app.use( express.json() );
        
        // ademas con express.static indicamos que deseamos publicar (En este caso la carpeta public su index)
        this.app.use( express.static('public') );

        //express-fileupload - sConfiguracion para manejar carga de archivos
        this.app.use(fileUpload({
            useTempFiles : true,
            tempFileDir : '/tmp/',
            createParentPath: true
        }));


    }

    routes() {
        // el primer argumento representa el path principal
        //el segundo argumento son las otras opciones que tendra el path principal
        this.app.use(this.paths.usuario, require('../routes/usuarios.routes.js'))

        this.app.use(this.paths.auth, require('../routes/auth.routes.js'))

        this.app.use(this.paths.categorias, require('../routes/categorias.routes.js'))
        
        this.app.use(this.paths.productos, require('../routes/productos.routes.js'))
        
        this.app.use(this.paths.buscar, require('../routes/buscar.routes.js'))

        this.app.use(this.paths.uploads, require('../routes/uploads.routes.js'))

    }

    liste(){ 
        /**
         * este es el metodo que hay que llamar en el app.js
         * para que la aplicacion se empiece a ejecutar
         * en el puerto definidio
         */
        this.app.listen( this.port, () => {
            console.log('Servidor corriendo en puerto ', this.port);
        } );
    }

}

module.exports =  Server;