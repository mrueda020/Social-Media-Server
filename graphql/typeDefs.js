const gql = require("graphql-tag");
module.exports = gql`
  type Post {
    id: ID!
    username: String!
    body: String!
    createdAt: String!
    comments: [Comment]!
    likes: [Like]!
  }
  type Comment {
    id: ID!
    createdAt: String!
    username: String!
    body: String!
  }
  type Like {
    id: ID!
    username: String!
    createdAt: String!
    likeCount: Int!
    commentCount: Int!
  }
  type Query {
    getPosts: [Post]
    getPost(postId: ID!): Post!
  }

  input RegisterInput {
    username: String!
    password: String!
    confirmPassword: String!
    email: String!
  }
  type Mutation {
    register(registerInput: RegisterInput): User!
    login(username: String!, password: String!): User!

    createPost(body: String!): Post!
    deletePost(postId: ID!): String!

    createComment(postId: ID!, body: String!): Comment!
    deleteComment(postId: ID!, commentId: ID): Comment!

    likePost(postId: ID!): Post!
  }

  type User {
    id: ID!
    email: String!
    token: String!
    username: String!
    createdAt: String!
  }

  type Subscription {
    newPost: Post!
  }
`;
