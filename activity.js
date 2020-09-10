const { ApolloServer, gql, ForbiddenError } = require("apollo-server");
const { buildFederatedSchema } = require("@apollo/federation");
const { activities } = require("./data");

const port = 4002;

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
    activity(_, { id }, { user }) {
      const activity = activities.find(activity => activity.id === id);

      if(activity.authorId !== user.userId) {
        throw new ForbiddenError("you are not allowed")
      }

      return activity;
    },
    activities() {
      return activities;
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
  schema: buildFederatedSchema([{ typeDefs, resolvers }]),
  context: ({ req }) => {
    const user = req.headers.user ? JSON.parse(req.headers.user) : null;
    return { user };
  }
});

server.listen({ port }).then(({ url }) => {
  console.log(`Activity service ready at ${url}`);
});
