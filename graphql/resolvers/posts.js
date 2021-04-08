const Post = require('../../models/Post');
const checkAuth = require('../../util/check-auth');
const { AuthenticationError } = require('apollo-server');

module.exports = {
    Query: {
        getPosts: async () => {
            try{
                const posts = await Post.find().sort({ createdAt: -1 });
                
                return posts;
            } catch (err) {
                throw new Error(err);
            }
        },
        getPost: async (_, { postId }) => {
            try{
                const post = await Post.findById(postId);
                if(post){
                    return post;
                } else {
                    throw new Error('Post not found')
                }
            } catch (err) {
                throw new Error(err);
            }
        }
    },
    Mutation: {
        createPost: async (_, { body }, context) => {
            const user = checkAuth(context);
            if (body.trim() === ''){
                throw new Error('Post body must not be empty')
            }
            const newPost = new Post({
                body,
                user: user.id,
                username: user.username,
                createdAt: new Date().toISOString()
            });

            const post = await newPost.save();
            
            return post;
        },
        deletePost: async (_,{ postId }, context) => {
            const user = checkAuth(context);
            try {
                const post = await Post.findById(postId);
                if(user.username === post.username){
                    await post.delete();
                    return 'Post was deleted successfully';
                } else {
                    throw new AuthenticationError('Action not allowed')
                }
            } catch(err) {
                throw new Error(err)
            }
        }
    },
    Subscription: {
        newPost: {
            subscibe: (_, __, { pubsub }) => pubsub.asyncIterator('NEW_POST')
        }
    }
}