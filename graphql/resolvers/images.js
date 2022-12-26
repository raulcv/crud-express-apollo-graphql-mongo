
// const { AuthenticationError, UserInputError } = require('apollo-server-express');

import { GraphQLError } from 'graphql';
import { Image } from '../../models';
const checkAuth = require('../../utils/check-auth');
// import { PubSub } from 'graphql-subscriptions';
// const pubsub = new PubSub();

module.exports = {
    Query: {
        async getImages() {
            try {
                const images = await Image.find().sort({ createdat: -1 });
                //console.log(images);
                return images;
            } catch (err) {
                throw new Error(err)
            }
        },
        async getImage(_, { imgId }) {
            try {
                const image = await Image.findById(imgId);
                console.log(image);
                if (image) {
                    return image;
                } else {
                    // throw new Error('Imagen no funciona');
                    throw new GraphQLError('Imagen no funciona');
                }
            } catch (err) {
                throw new Error(err);
            }
        }
    },

    Mutation: {
        async addImage(_, { title }, context) {
            console.log("context pussub: ", context.pubsub);
            // console.log("context: request - headers - authorization");
            // console.log(context.req.headers);
            const user = checkAuth(context);
            if(title.trim() === ''){
                throw new GraphQLError('Debes postear una imagen/No puede estar vacio')
            }
            //console.log(user);
            const newImage = await Image({
                title,
                user: user.id,
                username: user.username,
                createdat: new Date().toISOString()
            });
            const image = await newImage.save();
            context.pubsub.publish('NEW_IMAGE', {
                newImage: image
            }); //Emitir una notificacion a mis suscriptores al postear una imagen
            // pubsub.publish('NEW_IMAGE', {
            //     newImage: image
            // }); //Emitir una notificacion a mis suscriptores al postear una imagen
            return image;
        },
        async deleteImage(_, { imgId }, context) {
            const user = checkAuth(context);
            try {
                const image = await Image.findById(imgId);
                if (user.username === image.username) {
                    console.log(image);
                    await image.delete();
                    return 'Imagen eliminado correctamente';
                } else {
                    // throw new AuthenticationError('Accion no permitido');
                    throw new GraphQLError('Accion no permitido');
                }
            } catch (err) {
                throw new Error(err);
            }
        },
        //LIKE PARA LA IMAGEN
        async likeImage(_, { imgId }, context) {//ERROR SIN DESCRIPCION, POR NO IMPORTAR BIEN ALGO O ERROR EN LOGICA
            const { username } = checkAuth(context);
            const image = await Image.findById(imgId);
            if (image) {
                if (image.likes.find((like) => like.username === username)) { //Si imagen ya tiene Like, DesLike imagen
                    image.likes = image.likes.filter((like) => like.username !== username);
                } else { //Si imagen no tiene likes
                    image.likes.push({
                        username,
                        createdat: new Date().toISOString()
                    });
                }
                await image.save();
                return image;
            } else {//Si Imagen no existe
                // throw new UserInputError('Imagen no encontrado, Parece que fue eliminado');
                throw new GraphQLError('Imagen no encontrado, Parece que fue eliminado');
            }
        }
    },
    //SUSCRIPCION - Este otra funcionalidad, no es Mutation
    Subscription: {
        newImage: {
            subscribe: (_, __, { pubsub }) => pubsub.asyncIterator('NEW_IMAGE') //Este es un evento para recibir una  notificacion
        }
    }
};
