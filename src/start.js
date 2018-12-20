import { MongoClient } from 'mongodb';
import { ApolloServer } from 'apollo-server';
import { makeExecutableSchema } from 'graphql-tools';
// import { clog, getUser, getToken } from "./helpers";
import * as quipObject from './schemas/objects';

// const URL = 'http://localhost';
const PORT = 8888;
// const MONGO_URL = 'mongodb://localhost:27017/blog'
const MONGO_URL = 'mongodb://quip3.bmi.stonybrook.edu:27017/quip';
let theSchema;


const mySchema = async () => {
  const quipSchema = await makeExecutableSchema({
    typeDefs: [
      quipObject.baseObject,
    ],
    resolvers: quipObject.objectResolvers,
  });

  return (quipSchema);
};

mySchema().then((x) => {
  theSchema = x;
});

export const start = async () => {
  try {
    const db = await MongoClient.connect(MONGO_URL);

    const server = new ApolloServer({
      schema: theSchema,
      context: ({ req }) => ({ req, db }),
      engine: false,
    });

    server.listen(PORT).then(({ url }) => {
      console.log(`🚀  Server ready at ${url}`);
    });
  } catch (e) {
    console.log(e);
  }
};
