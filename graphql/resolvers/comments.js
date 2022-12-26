// const { AuthenticationError , UserInputError } = require('apollo-server-express');
import { GraphQLError } from 'graphql'
import { Image } from '../../models';
const checkAuth = require('../../utils/check-auth');

module.exports = {
    Mutation: {
        addComment: async (_, { imgId, comment }, context) => {
            const { username } = checkAuth(context);
            if (comment.trim() === '') {
                // throw new UserInputError('Comentario Vacio', {
                //     errors: {
                //         comment: 'Comentario no puede ser vacio'
                //     }
                // });
                throw new GraphQLError("Comentario Vacio", {
                    extensions: {
                        code: 'FORBIDDEN',
                        myExtension: "Comentario no puede ser vacio",
                    },
                });
            }
            const image = await Image.findById(imgId);
            if (image) {
                image.comments.unshift({
                    comment,
                    username,
                    createdat: new Date().toISOString()
                })
                //console.log(image)
                await image.save();
                return image;
            } else throw new GraphQLError('Imagen no funciona') // UserInputError('Imagen no funciona');
        },
        //ELIMINAR COMENTARIO
        async deleteComment(_, { imgId, commentId }, context) {
            const { username } = checkAuth(context);
            const image = await Image.findById(imgId);
            if (image) {
                const commentIndex = image.comments.findIndex((c) => c.id === commentId);
                if (image.comments[commentIndex].username === username) {
                    image.comments.splice(commentIndex, 1);
                    await image.save();
                    return image;
                } else {
                    throw new GraphQLError('Accion no encontrado.') //UserInputError('Accion no encontrado.'); //Esto es solo por seguridad, puede que aluien intenete eliminar con algun programa.
                }
            } else {
                throw new GraphQLError('Imagen no funciona, imagen no encontrado') //AuthenticationError('Imagen no funciona, imagen no encontrado');
            }
        }
    }
}