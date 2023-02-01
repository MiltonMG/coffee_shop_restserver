const { request, response } = require("express")


const esAdminRole = (req = request, res = response, next) => {

    if (!req.usuario) { //verificar si el req tiene la informacion dle usuario
        return res.status(500).json({
            msg: 'Se quiere verificar el rol sin validar el token primero'
        })
    }

    const {role, name}  = req.usuario;

    if (role !== 'ADMIN_ROLE') {
        return res.status(401).json({
            msg: `${name} no es administrador - no puede hacer esto`
        });
    }

    next();

}

const tieneRole = ( ...roles) => {

    return (req = request, res = response, next) => {
        
            if (!req.usuario) { //verificar si el req tiene la informacion dle usuario
                return res.status(500).json({
                    msg: 'Se quiere verificar el rol sin validar el token primero'
                })
            }

            if (!roles.includes(req.usuario.role)) {
                
                return res.status(401).json({
                    msg: `${req.usuario.name} no tiene el rol necesario - no puede hacer esto`
                });
            }

            next();
        }
        
}

module.exports = {
    esAdminRole,
    tieneRole
}

