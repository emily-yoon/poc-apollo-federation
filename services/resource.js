const { ApolloServer, gql } = require("apollo-server");
const { buildFederatedSchema } = require("@apollo/federation");
const { resources } = require("../data");

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
      return resources.find(resource => resource.id === id)
    },
    resources() {
      return resources;
    }
  },
  Resource: {
    __resolveReference(ref) {
      return resources.find(resource => resource.id === ref.id)
    }
  }
};

const runResourceServer = async ({ port }) => {
  const server = new ApolloServer({
    schema: buildFederatedSchema([{ typeDefs, resolvers }])
  });
  
  return server.listen({ port });  
}

module.exports = { runResourceServer };
