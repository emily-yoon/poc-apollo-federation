const { ApolloServer, gql } = require("apollo-server");
const { buildFederatedSchema } = require("@apollo/federation");
const { ApolloGateway } = require("@apollo/gateway");
const fetch = require("node-fetch");

const apiUrl = "http://localhost:3000";

const typeDefs = gql`
  extend type Query {
    resource(id: ID!): Resource
    resources: [Resource]
  }

  type Resource @key(fields: "id"){
    id: ID!
    name: String
  }
`;

const resolvers = {
  Query: {
    resource(_, { id }) {
      return fetch(`${apiUrl}/resources/${id}`).then(res => res.json());
    },
    resources() {
      return fetch(`${apiUrl}/resources`).then(res => res.json());
    }
  },
  Resource: {
    __resolveReference(ref) {
      return fetch(`${apiUrl}/resources/${ref.id}`).then(res => res.json());
    }
  }
};

const runResourceServer = async ({ port }) => {
  const server = new ApolloServer({
    schema: buildFederatedSchema([{ typeDefs, resolvers }])
  });
  
  return server.listen({ port });  
}

const runGatewayServer = ({ port }) => {
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
  
  return server.listen(port);
}

runResourceServer({ port: 4001 })
  .then(({ url }) => {
    console.log(`Resource service ready at ${url}`);

    runGatewayServer({ port: 4000 })
      .then(({ url }) => {
        console.log(`Federation service ready at ${url}`);
      }); 
  });  
