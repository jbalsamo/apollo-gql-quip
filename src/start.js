import {MongoClient} from 'mongodb';
import { ApolloServer, gql } from 'apollo-server';
import { mergeSchemas, makeExecutableSchema } from 'graphql-tools';
import {prepare} from "../utill/index";
import {clog, getUser, getToken} from "./helpers";
import * as GeoJSON from 'graphql-geojson';
import * as quipObject from './schemas/objects';

const URL = 'http://localhost';
const PORT = 8888;
//const MONGO_URL = 'mongodb://localhost:27017/blog'
const MONGO_URL = 'mongodb://quip3.bmi.stonybrook.edu:27017/quip';
var db, Objects;

const quipSchema = makeExecutableSchema({
  typeDefs: quipObject.baseObject,
  resolvers: quipObject.objectResolvers
})



/* const linkSchema = makeExecutableSchema({
  typeDefs: linkTypeDefs
}) */

const mySchema = mergeSchemas({
  schemas: [
    Object.values(GeoJSON), 
    quipSchema
  ]
});

const workingSchema = mergeSchemas({
  schemas: [
    mySchema,
    linkSchema
  ]
});



export const start = async () => {
  try {
    db = await MongoClient.connect(MONGO_URL);

    Objects = db.collection("objects");

    const server =  new ApolloServer({
      schema: mySchema,
      context: ({ req }) => ({ req }),
      engine: false
    });

    server.listen(PORT).then(({url}) => {
      console.log(`🚀  Server ready at ${url}`);
    });

  } catch (e) {
   console.log(e);
  };
}
