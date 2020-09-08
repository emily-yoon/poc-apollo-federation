const { ApolloServer, gql } = require("apollo-server");
const { buildFederatedSchema } = require("@apollo/federation");
const fetch = require("node-fetch");

const port = 4002;
const apiUrl = "http://localhost:3000";

const typeDefs = gql`
  extend type Query {
    user(id: ID!): User
    users: [User]
  }

  type User @key(fields: "id"){
    id: ID!
    name: String
  }
`;

const resolvers = {
  Query: {
    user(_, { id }) {
      return fetch(`${apiUrl}/users/${id}`).then(res => res.json());
    },
    users() {
      return fetch(`${apiUrl}/users`).then(res => res.json());
    }
  }
};

const server = new ApolloServer({
  schema: buildFederatedSchema([{ typeDefs, resolvers }])
});

server.listen({ port }).then(({ url }) => {
  console.log(`User service ready at ${url}`);
});
