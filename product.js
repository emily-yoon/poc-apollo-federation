const { ApolloServer, gql } = require("apollo-server");
const { buildFederatedSchema } = require("@apollo/federation");
const { ApolloGateway } = require("@apollo/gateway");
const fetch = require("node-fetch");

const apiUrl = "http://localhost:3000";

const typeDefs = gql`
  extend type Query {
    product(id: ID!): Product
    products: [Product]
  }

  type Product @key(fields: "id"){
    id: ID!
    title: String
  }
`;

const resolvers = {
  Query: {
    product(_, { id }) {
      return fetch(`${apiUrl}/products/${id}`).then(res => res.json());
    },
    products() {
      return fetch(`${apiUrl}/products`).then(res => res.json());
    }
  }
};

const runProductServer = async ({ port }) => {
  const server = new ApolloServer({
    schema: buildFederatedSchema([{ typeDefs, resolvers }])
  });
  
  return server.listen({ port });  
}

const runGatewayServer = ({ port }) => {
  const gateway = new ApolloGateway({
    serviceList: [
      { name: 'product', url: 'http://localhost:4001' },
      { name: 'user', url: 'http://localhost:4002' }
    ]
  });
  
  const server = new ApolloServer({ 
    gateway,
    subscriptions: false 
  });
  
  return server.listen(port);
}

runProductServer({ port: 4001 })
  .then(({ url }) => {
    console.log(`Product service ready at ${url}`);

    runGatewayServer({ port: 4000 })
      .then((url) => {
        console.log(`Gateway service ready at ${url}`);
      }); 
  });  
