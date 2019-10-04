const usersResolvers = require('./users');//Bienen de resolvers
const imagesResolvers = require('./images');
const commentsResolvers = require('./comments')
module.exports = {
    Image: {
        likeCount(parent){ //parent retorna todos las imagenes con todos sus campos. = a GETIMAGES
            //console.log(parent);
            return parent.likes.length;
        },
        commentCount: (parent) => parent.comments.length
    },
    Query: {
        ...imagesResolvers.Query,
        ...usersResolvers.Query
    },
    Mutation: {
        ...usersResolvers.Mutation,
        ...imagesResolvers.Mutation,
        ...commentsResolvers.Mutation
    },
    Subscription: {
        ...imagesResolvers.Subscription //Por confundirse por aca tambien sale error indefinido
    }
};