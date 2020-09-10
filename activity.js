const { ApolloServer, gql } = require("apollo-server");
const { buildFederatedSchema } = require("@apollo/federation");
const fetch = require("node-fetch");

const port = 4002;
const apiUrl = "http://localhost:3000";

const typeDefs = gql`
  extend type Query {
    activity(id: ID!): Activity
    activities: [Activity]
  }

  type Activity {
    id: ID!
    name: String
    resourceId: ID
    resource: Resource
  }

  extend type Resource @key(fields: "id") {
    id: ID! @external # tells Apollo the field was defined in the originating service
  }
`;

const resolvers = {
  Query: {
    activity(_, { id }) {
      return fetch(`${apiUrl}/activities/${id}`).then(res => res.json());
    },
    activities() {
      return fetch(`${apiUrl}/activities`).then(res => res.json());
    }
  },
  Activity: {
    resource(activity) {
      // typename and id to identify the object in the originating service
      return { __typename: "Resource", id: activity.resourceId };
    }
  }
};

const server = new ApolloServer({
  schema: buildFederatedSchema([{ typeDefs, resolvers }])
});

server.listen({ port }).then(({ url }) => {
  console.log(`Activity service ready at ${url}`);
});
