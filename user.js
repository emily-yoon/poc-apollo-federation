const { ApolloServer, gql, ForbiddenError } = require("apollo-server");
const { buildFederatedSchema } = require("@apollo/federation");
const { users } = require("./data");

const port = 4003;

const typeDefs = gql`
  extend type Query {
    user(id: ID!): User
    users: [User]
  }

  type User {
    id: ID!
    name: String
  }
`;

const resolvers = {
  Query: {
    user(_, { id }) {
      return users.find(user => user.id === id);
    },
    users() {
      return users;
    }
  }
};

const server = new ApolloServer({
  schema: buildFederatedSchema([{ typeDefs, resolvers }])
});

server.listen({ port }).then(({ url }) => {
  console.log(`User service ready at ${url}`);
});
