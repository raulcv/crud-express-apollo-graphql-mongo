const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../../models');
const { SECRET_KEY } = require('../../db/key');
// const { UserInputError } = require('apollo-server-express');
const { validateRegisterInput, validateLoginInput } = require('../../utils/validators');
const { GraphQLError } = require('graphql');

function generateToken(user){
    return jwt.sign({
        id: user.id,
        email: user.email,
        username: user.username
    }, SECRET_KEY, { expiresIn: '1h' });
}

module.exports = {
   /* Query: {
        async getUsers() {
            try {
                const users = await User.find();
                console.log(users)
                return users;
            } catch (err) {
                throw new Error(err);
            }
        }
    },*/
    Mutation: {
        async register(_,
            { registerInput: { username, email, pwd, confirmPwd } }) { // (parent, args, context, info ) Parent se usa cuando hay multiples resolvers
            //Validation de datos del usuario
            const { valid, errors } = validateRegisterInput( username, email, pwd, confirmPwd );
            if(!valid){
                throw new GraphQLError('Errors', { errors });
            }
            //Verificando que username no exista en BD
            const user = await User.findOne({ username });
            if (user) { //If user exist or if user is not null
                // throw new UserInputError('Nombre de usuario ya esta tomado', {
                //     errors: {
                //         username: 'Este usuario ya esta en uso'
                //     }
                // })
                throw new GraphQLError('Nombre de usuario ya esta tomado')
            }
            //Hash pwd y autenticacion del usuario con token
            pwd = await bcrypt.hash(pwd, 12);
            const newUser = new User({
                email,
                username,
                pwd,
                createdat: new Date().toISOString()
            });
            const result = await newUser.save();
            const token = generateToken(result);
            //console.log(user);
            return {
                ...result._doc,
                id: result._id,
                token
            };
        },
        //LOGIN DEL USUARIO Y VALIDACIONES
        async login(_, {username, pwd}){
            const {errors, valid} = validateLoginInput(username, pwd)
            if(!valid){
                // throw new UserInputError('Errors', {errors});
                throw new GraphQLError('Errors', {errors});
            }

            const user = await User.findOne({username});
            if(!user){
                errors.general = 'Usuario no encontrado';
                // throw new UserInputError('Usuario no encontrado', {errors});
                throw new GraphQLError('Usuario no encontrado', {errors});
            }
            const match = await bcrypt.compare(pwd, user.pwd);
            if(!match){
                errors.general = 'Credenciales incorrectos';
                // throw new UserInputError('Credenciales incorrectos', {errors});
                throw new GraphQLError('Credenciales incorrectos', {errors});
            }
            const token = generateToken(user);
            //console.log(user);
            return {
                ...user._doc,
                id: user._id,
                token
            };
        }
    }
};
