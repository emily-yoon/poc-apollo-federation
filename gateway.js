const { ApolloServer } = require("apollo-server-express");
const { ApolloGateway } = require("@apollo/gateway");
const express = require("express");
const { runResourceServer } = require ('./resource.js');

const runGatewayServer = ({ port }) => {
  const app = express();

  const gateway = new ApolloGateway({
    serviceList: [
      { name: 'resource', url: 'http://localhost:4001' },
      { name: 'activity', url: 'http://localhost:4002' }
    ]
  });
  
  const server = new ApolloServer({ 
    gateway,
    subscriptions: false 
  });

  server.applyMiddleware({ app });
  
  app.listen({ port }, () => 
    console.log(`Federated gateway ready at http://localhost:4000${server.graphqlPath}`)
  );
}

runResourceServer({ port: 4001 })
  .then(({ url }) => {
    console.log(`Resource service ready at ${url}`);
    runGatewayServer({ port: 4000 });
  });  
