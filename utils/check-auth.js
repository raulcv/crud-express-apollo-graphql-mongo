// const { AuthenticationError } = require('apollo-server-express');
const { GraphQLError } = require('graphql');
const jwt = require('jsonwebtoken');
const { SECRET_KEY } = require('../db/key');

module.exports = (context) => {
    const authHeader = context.req.headers.authorization;
    if (authHeader) {
        const token = authHeader.split('Bearer ')[1];
        if (token) {
            try {
                const user = jwt.verify(token, SECRET_KEY);
                return user;
            } catch (err) {
                // throw new AuthenticationError('Invalido/Token expirado');
                throw new GraphQLError('Invalido/Token expirado');
            }
        }
        throw new Error('El token de Autenticacion debe ser \'Bearer [token]');
    }
    throw new Error('Debe proporcionar el encabezado de autorizacion');
};