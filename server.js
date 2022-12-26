import 'dotenv/config'
import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';

import { makeExecutableSchema } from '@graphql-tools/schema';
import { WebSocketServer } from 'ws';
import { useServer } from 'graphql-ws/lib/use/ws';

import { expressMiddleware } from '@apollo/server/express4';
import { PubSub } from 'graphql-subscriptions';

const http = require('http');
import cors from 'cors';
import { json } from 'body-parser';
import express from 'express';
import resolvers from './graphql/resolvers';
import typeDefs from './graphql/typedesfs';
import mongoDBConnection from './db/dbconexion';

const pubsub = new PubSub();

const PORT = 3003;
const app = express();
const schema = makeExecutableSchema({ typeDefs, resolvers });
const httpServer = http.createServer(app);

/**
 * ws Server
 * Create our WebSocket server using the HTTP server we just set up.
 **/
const wsServer = new WebSocketServer({
  server: httpServer,
  path: '/graphql',
});

const getDynamicContext = async (ctx, msg, args) => {
  //ctx is the graphql-ws Context where connectionParams live
  if (ctx.connectionParams.authentication) {
    const currentUser = await findUser(ctx.connectionParams.authentication);
    return { currentUser };
  }
  // console.log("ctx: ", ctx);
  // console.log("msg: ", msg);
  // console.log("args: ", args);
  // Otherwise let our resolvers know we don't have a current user
  return { currentUser: null };
};


/**
 * Save the returned server's info so we can shutdown this server later
 */
const serverCleanup = useServer(
  {
    schema,
    context: async (ctx, msg, arg) => {

      return getDynamicContext(ctx, msg, arg)
    },
  },
  wsServer);

const startServer = async () => {
  /**
   * Apollo Server
   */
  const server = new ApolloServer({
    csrfPrevention: true,
    schema,
    plugins: [
      // Proper shutdown for the HTTP server.
      ApolloServerPluginDrainHttpServer({ httpServer }),
      // Proper shutdown for the WebSocket server.
      {
        async serverWillStart() {
          return {
            async drainServer() {
              await serverCleanup.dispose();
            },
          };
        },
      }
    ],
    instrospection: true,
  })

  await server.start() // Start the server

  await app.use(
    '/graphql',
    cors(),
    json(),
    expressMiddleware(server, {
      // context: async ({ req, }) => ({ token: req.params.token })
      context: async ({ req, }) => ({ req, pubsub })
    },
    )
  )// Apply middleware (cors, expressmiddlewares)
  // const { url } = await startStandaloneServer(server);
  await new Promise((resolve) => httpServer.listen({ port: PORT }, resolve))

  // console.log(`🚀 Server ready at ${url}`);

  console.log(`🚀 Server ready at http://localhost:${PORT}${'/graphql'}`)
  // console.log(`🚀 Subscriptions ready at ws://localhost:${PORT}${server.subscriptionsPath}`)
  await mongoDBConnection()
}
startServer()