import {MongoClient, ObjectId} from 'mongodb'
import express from 'express'
import bodyParser from 'body-parser'
import {graphqlExpress, graphiqlExpress} from 'graphql-server-express'
import {makeExecutableSchema} from 'graphql-tools'
import cors from 'cors'
import {prepare} from "../utill/index"


const app = express()

app.use(cors())

const homePath = '/graphiql'
const URL = 'http://localhost'
const PORT = 8888
//const MONGO_URL = 'mongodb://localhost:27017/blog'
const MONGO_URL = 'mongodb://nexi-bmi.uhmc.sunysb.edu:27017/quip'
var db;

export const start = async () => {
  try {
    db = await MongoClient.connect(MONGO_URL)

    const Objects = db.collection("objects")
    
    const typeDefs = [`
      type Query {
        objectsByExecID(execution_id: String, case_id: String, limit: Int): [Object]
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
        _id: ID
        type: String
        parent_id: String
        randval: Float
        creation_date: String
        object_type: String
        x: Float
        y: Float
        normalized: Boolean
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
    `];

    const resolvers = {
      Query: {
        objectsByExecID: async (root, args) => {
          return (await Objects.find({ "randval": {$gte:0}, "provenance.analysis.source":"computer", "provenance.analysis.execution_id" : args.execution_id, "provenance.image.case_id": args.case_id }).limit(args.limit).toArray());
        },
        allObjects: async () => {
          return (await Objects.find({ "randval": {$gte:0},"provenance.analysis.source":"computer" }).limit(1000).toArray()).map(prepare);
        }
      },
    }

    const schema = makeExecutableSchema({
      typeDefs,
      resolvers
    })


    app.use('/graphql', bodyParser.json(), graphqlExpress({schema}))


    app.use(homePath, graphiqlExpress({
      endpointURL: '/graphql'
    }))

    app.listen(PORT, () => {
      console.log(`Visit ${URL}:${PORT}${homePath}`)
    })

  } catch (e) {
    console.log(e)
  }

}
