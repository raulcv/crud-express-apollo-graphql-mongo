const { AuthenticationError } = require('apollo-server-express');
const jwt = require('jsonwebtoken');
const { SECRET_KEY } = require('../db/key');

module.exports = (context) => {
    // context = { .... Hearder }
    const authHeader = context.req.headers.authorization;
    if(authHeader){
        // Bearer .....
        const token = authHeader.split('Bearer ')[1]; //Bearer trae dos string en un arreglo, necesito el 2, por eso [1]
        if(token){ //Si es valido el token si el Bearer
            try{
                const user = jwt.verify(token, SECRET_KEY);
                return user;
            }catch(err){
                throw new AuthenticationError('Invalido/Token expirado');
            }
        }
        throw new Error('El token de Autenticacion debe ser \'Bearer [token]');
    }
    throw new Error('Debe proporcionar el encabezado de autorizacion');
};