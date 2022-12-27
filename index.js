import { ApolloServer, PubSub } from "apollo-server-express";
const http = require("http");
import express from "express";
import conexion from "./db/dbconexion";
import resolvers from "./graphql/resolvers";
import typeDefs from "./graphql/typedesfs";
const pubsub = new PubSub();

const PORT = 3000;

const startServer = async () => {
  const app = express();

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => ({ req, pubsub }),
  });

  server.applyMiddleware({ app });

  const httpServer = http.createServer(app);
  server.installSubscriptionHandlers(httpServer);

  conexion;

  httpServer.listen(PORT, () => {
    console.log(
      `🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`
    ),
      console.log(
        `🚀 Subscriptions ready at ws://localhost:${PORT}${server.subscriptionsPath}`
      );
  });
};

startServer();
