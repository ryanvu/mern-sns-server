const { UserInputError } = require('apollo-server-errors');
const Post = require('../../models/Post');
const checkAuth = require('../../util/check-auth');

module.exports = {
    Mutation:{
        likePost: async (_, {postId}, context) => {
            const { username } = checkAuth(context);

            const post = await Post.findById(postId);
            if(post){
                if(post.likes.find(like => like.username === username)){
                    //Post alreadu likes, unlike it
                    post.likes = post.likes.filter(like => like.username !== username)
                  
                } else {
                    //not liked, like post
                    post.likes.push({
                        username,
                        createdAt: new Date().toISOString()
                    })
                }
                await post.save();
                return post;
            } else throw new UserInputError('Post not found!')
        },
        likeComment: async (_, {postId, commentId}, context) => {
            const { username } = checkAuth(context);

            const post = await Post.findById(postId);
            
            if(post){
                const commentIndex = post.comments.findIndex(com => com.id === commentId)
                const comment = post.comments[commentIndex]
               
                if(post.comments[commentIndex].likes.find(like => like.username === username)){
                    post.comments[commentIndex].likes = post.comments[commentIndex].likes.filter(like => like.username !== username)
                } else {
                    post.comments[commentIndex].likes.push({
                        username,
                        createdAt: new Date().toISOString()
                    })
                }
                await post.save();
                return post;
            } else throw new UserInputError('Post not found')
        }
    }
}