const { validationResult } = require("express-validator");

/*Este middleware nos sirve para poder capturar los errores q 
todos los demas middlewares tuvieron y poder cortar la secuencia del codigo
si no hay error pues el metodo "next()" se encarga de decir q el codigo puede continuar

Por eso es q este middleware siempre va al final de todos los demas 
*/
const validarCampos = ( req, res, next ) => {

    //Mostrando si hay errores en el middlewares que se colocaron en las rutas
    const errors = validationResult(req);
    if (!errors.isEmpty() ) {
        return res.status(400).json(errors);
    }

    next();

}


module.exports = {
    validarCampos
}