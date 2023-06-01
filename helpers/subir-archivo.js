const path = require('path');
const { v4: uuidv4 } = require('uuid');

const subirArchivo = ( files, extensionesValidas = ['png', 'jpg', 'jpeg', 'gif'], carpeta = '' ) => {

    return new Promise( (resolve, reject) => {
        
        const { archivo } = files;

        //cortar el nombre del archivo donde encuentre un .
        const nombreCortado = archivo.name.split('.');
        
        //Sacamos la extension del archivo de la constante nombreCortado
        const extension = nombreCortado[ nombreCortado.length-1 ]
    
        //Validar extensiones posibles
        if (!extensionesValidas.includes( extension )) {
            return reject('La extension del archivo no es valida, solo permitimos las siguientes extensiones: ' + extensionesValidas)
        }
    
        //Creamos un nombre temporal para el archivo
        const nombreTemp = uuidv4()+'.'+extension;
    
        //Creamos el path donde queremos guardar el archivo 
        //(Join nos permite unir o juntar pedazos de rutas por separado para tener como salida una ruta resultante final)
        const uploadPath = path.join(__dirname, '../uploads/', carpeta, nombreTemp);
        
        // Movemos el archivo hacia el path donde queremos guardarlo
        archivo.mv(uploadPath, (err) => {
            if (err) {
                reject(err);
            }
    
            resolve(nombreTemp);
        });
    } )

}


module.exports = {
    subirArchivo
}