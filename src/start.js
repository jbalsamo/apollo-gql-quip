import {MongoClient} from 'mongodb';
import { ApolloServer, gql } from 'apollo-server';
import {prepare} from "../utill/index";
import {clog, getUser, getToken} from "./helpers";

const homePath = '/graphiql';
const URL = 'http://localhost';
const PORT = 8888;
//const MONGO_URL = 'mongodb://localhost:27017/blog'
const MONGO_URL = 'mongodb://quip3.bmi.stonybrook.edu:27017/quip';
var db;

export const start = async () => {
  try {
    db = await MongoClient.connect(MONGO_URL);

    const Objects = db.collection("objects");
    
     const typeDefs =gql`
      type Query {
        objectsByExecID(execution_id: String, case_id: String, limit: Int,): [Object]
        allObjects: [Object]
      }

      type Coordinate {
        xyarr: [Float]
      }

      type Coordinates {
        coordinateArr: [Coordinate]
      }

      type Geometry {
        type: String
        coordinates: [Coordinates]
      }

      type NV {
        name: String
        value: Float
      }

      type Scalar_Features {
        ns: String
        nv: [NV]
      }

      type Properties {
        scalar_features: [Scalar_Features]
      }

      type Analysis {
        execution_id: String
        study_id: String
        source: String
        computation: String
      }

      type Image {
        case_id: String
        subject_id: String
      }

      type Provenance {
        image: Image
        analysis: Analysis
        data_loader: String
        batch_id: String
        tag_id: String
      }

      type Object {
        _id: String!
        type: String
        parent_id: String
        randval: Float
        creation_date: String
        object_type: String
        x: Float
        y: Float
        normalized: String
        bbox: [Float]
        geometry: Geometry
        footprint: Int
        properties: Properties
        provenance: Provenance
        submit_date: String
      }

      schema {
        query: Query
      }
    `;

    const resolvers = {
      Query: {
        objectsByExecID: async (root, args,context) => {
          var token = null;
          var user = null;
          const myQuery = {
            "randval": {$gte:0},
            "provenance.analysis.source":"computer", 
            "provenance.analysis.execution_id" : args.execution_id, 
            "provenance.image.case_id": args.case_id 
          };
          var results = await Objects.find(myQuery).limit(args.limit).toArray();
          token = getToken(context.req.headers);
          user = getUser(token);
          clog({ 'user': user});
          clog({'token':token});
          if (typeof results != "undefined" && user.valid) {
            // clog(results);
            return(results.map(prepare));
          } else {
            throw("Authentication failure!");
            return({'error': "Data missing"});
          };
        },
        allObjects: async () => {
          return (await Objects.find({ "randval": {$gte:0},"provenance.analysis.source":"computer" }).limit(1000).toArray()).map(prepare);
        }
      },
    };

    // const schema = makeExecutableSchema({
    //   typeDefs,
    //   resolvers,
    //   context: ({ req }) => {
    //     console.log("This is in the contect function")
    //     // get the user token from the headers
    //     const token = req.headers.get('Authorization') || 'graphiql';
       
    //     // try to retrieve a user with the token
    //     const user = getUser(token);
        
    //     if (!user) throw new AuthorizationError('you must be logged in');
       
    //     // add the user to the context
    //     return {user};
    //   }
    // });

    const server =  new ApolloServer({
      typeDefs,
      resolvers,
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
