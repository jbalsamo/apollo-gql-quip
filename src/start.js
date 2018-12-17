import { MongoClient } from 'mongodb';
import { ApolloServer, gql } from 'apollo-server';
import { mergeSchemas, makeExecutableSchema } from 'graphql-tools';
import { clog, getUser, getToken } from "./helpers";
import * as GeoJSON from 'graphql-geojson';
import * as quipObject from './schemas/objects';
import * as extendObject from './schemas/extendObjects';

const URL = 'http://localhost';
const PORT = 8888;
//const MONGO_URL = 'mongodb://localhost:27017/blog'
const MONGO_URL = 'mongodb://quip3.bmi.stonybrook.edu:27017/quip';
var db, Objects, server,theSchema;


const mySchema = async () => {
  const quipSchema = await makeExecutableSchema({
    typeDefs: quipObject.baseObject,
    resolvers: quipObject.objectResolvers
  });
  console.log(quipSchema);
  console.log('Line 23');

  const mergedSchemas = await mergeSchemas({
    typeDefs: [
      Object.values(GeoJSON),
    ],
    schemas: [
      quipSchema,
    ],
  });
  console.log(mergedSchemas);
  console.log('Line 34');

  const workingSchema = await mergeSchemas({
    typeDefs: [
      extendObject.linkTypeDefs
    ],
    schemas: [
      mergedSchemas
    ]
  });
  console.log(workingSchema);

  return(workingSchema);
}



mySchema().then((x) => { theSchema=x; }); 

export const start = async () => {
  try {
    db = await MongoClient.connect(MONGO_URL);

    Objects = db.collection("objects");

    server =  new ApolloServer({
      schema: theSchema,
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
