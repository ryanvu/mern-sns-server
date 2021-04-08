const { ApolloServer, PubSub } = require('apollo-server');

const dotenv = require('dotenv').config();

const mongoose = require('mongoose');

const resolvers = require('./graphql/resolvers')

const typeDefs = require('./graphql/typeDefs');

const pubsub = new PubSub();

const PORT = process.env.NODE_ENV === "production" ? process.env.port || 5000 : 5000

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => ({ req })
});

mongoose
    .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("Mongo Connected")
        return server.listen({ port: PORT })
    })
    .then((res) => {
        console.log(`Server running at ${res.url}`)
    })
    .catch(err => {
        console.log(err);
    })
    

