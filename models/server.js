const express = require('express');
var cors = require('cors');

class Server {
    
    constructor(){
        //propiedades de nuestra clase
        this.app = express();
        this.port = process.env.PORT || 3000;
        this.usuarioPath = '/api/usuarios'

        //Middlewares
        this.middlewares();
        //llamamos al metodo rutas para inicializarlas
        this.routes();
    }

    middlewares(){
        // con app.use indicamos que lo siguiente es un middleware
        
        //CORS
        this.app.use( cors() );
        
        //parseo y lectura del body
        this.app.use( express.json() );
        
        // ademas con express.static indicamos que deseamos publicar (En este caso la carpeta public su index)
        this.app.use( express.static('public') )


    }

    routes() {
        this.app.use(this.usuarioPath, require('../routes/usuarios.routes.js'))
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
