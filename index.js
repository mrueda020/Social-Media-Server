const { ApolloServer, PubSub } = require("apollo-server");
const mongoose = require("mongoose");

const { MONGOURL } = require("./config");
const pubsub = new PubSub();
const typeDefs = require("./graphql/typeDefs");
const resolvers = require("./graphql/resolvers/index");
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => ({ req, pubsub }),
});

const PORT = process.env.port || 5000;

mongoose
  .connect(MONGOURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    server.listen({ port: PORT }).then((res) => {
      console.log(`Server Running at ${PORT}`);
    });
  });

mongoose.set("useFindAndModify", false);
