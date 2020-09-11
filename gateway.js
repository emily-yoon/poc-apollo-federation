const { ApolloServer } = require("apollo-server-express");
const { ApolloGateway, RemoteGraphQLDataSource } = require("@apollo/gateway");
const express = require("express");
const expressJwt = require("express-jwt");
const { runResourceServer } = require ('./services/resource.js');

const gatewayPort = 4000;
const resourcePort = 4001;

const runGatewayServer = ({ port }) => {
  const app = express();

  app.use(
    expressJwt({
      secret: "f1BtnWgD3VKY",
      algorithms: ["HS256"],
      credentialsRequired: false
    })
  );

  const gateway = new ApolloGateway({
    serviceList: [
      { name: 'resource', url: 'http://localhost:4001' },
      { name: 'activity', url: 'http://localhost:4002' },
      { name: 'user', url: 'http://localhost:4003' },
    ],
    buildService({ url }) {
      return new RemoteGraphQLDataSource({
        url,
        willSendRequest({ request, context }) {
          request.http.headers.set(
            "user",
            context.user ? JSON.stringify(context.user) : null
          );
        }
      });
    }
  });
  
  const server = new ApolloServer({ 
    gateway,
    subscriptions: false,
    context: ({ req }) => {
      const user = req.user || null;
      return { user };
    }
  });

  server.applyMiddleware({ app });
  
  app.listen({ port }, () => 
    console.log(`Federated gateway ready at http://localhost:${port}${server.graphqlPath}`)
  );
}

runResourceServer({ port: resourcePort })
  .then(({ url }) => {
    console.log(`Resource service ready at ${url}`);
    runGatewayServer({ port: gatewayPort });
  });  
