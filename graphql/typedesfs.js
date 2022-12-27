// import { gql } from "apollo-server-express";
import { gql } from "graphql-tag";
module.exports = gql`
  type Image {
    id: ID!
    title: String!
    createdat: String!
    username: String!
    comments: [Comment]!
    likes: [Like]!
    likeCount: Int!
    commentCount: Int!
  }
  type Comment {
    id: ID!
    createdat: String!
    username: String!
    comment: String!
  }
  type Like {
    id: ID!
    createdat: String!
    username: String!
  }
  type User {
    id: ID!
    email: String!
    token: String!
    username: String!
    createdat: String!
  }

  input RegisterInput {
    username: String!
    pwd: String!
    confirmPwd: String!
    email: String!
  }
  type Query {
    getImages: [Image!]!
    getImage(imgId: ID!): Image!
  }
  type Mutation {
    register(registerInput: RegisterInput): User!
    login(username: String!, pwd: String!): User!
    addImage(title: String!): Image!
    deleteImage(imgId: ID!): String!
    addComment(imgId: String!, comment: String!): Image!
    deleteComment(imgId: ID!, commentId: ID!): Image!
    likeImage(imgId: ID!): Image!
  }
  type Subscription {
    newImage: Image!
  }
`;

/* type Query {
        getUsers: [User!]!
    }*/
