const postsResolvers = require('./posts');
const usersResolvers = require('./users');
const commentsResolvers = require('./comments');
const likesResolvers = require('./likes')

module.exports = {
    Post: {
        likeCount: (parent) => {
            return parent.likes.length;
        },
        commentCount: (parent) => {
            return parent.comments.length;
        }
    },
    Query: {
        ...postsResolvers.Query
    },
    Mutation: {
        ...usersResolvers.Mutation,
        ...postsResolvers.Mutation,
        ...commentsResolvers.Mutation,
        ...likesResolvers.Mutation
    },
    Subscription:{
        ...postsResolvers.Subscription
    }
}