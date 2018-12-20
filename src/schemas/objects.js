/*----------------------------------------
 * @file Schema and resolvers for Quip 2.x data
 * @module schemas/objects
 * @author Joseph Balsamo
 * @version 0.9.5
 *----------------------------------------*/
import { gql } from 'apollo-server';
import { GraphQLScalarType } from 'graphql';
import { prepare } from '../../utill/index';
import { getUser, getToken } from '../helpers';

/*----------------------------------------
 * @constant
 * @type {GraphQLScalarType}
 *----------------------------------------*/
const Coordinates = new GraphQLScalarType({
  name: 'Coordinates',
  description: 'Coordinates for lines and Polygons in GeoJson format',
  serialize(value) {
    const result = value;
    // Implement custom behavior by setting the 'result' variable
    return result;
  },
  parseValue(value) {
    const result = value;
    // Implement custom behavior here by setting the 'result' variable
    return result;
  },
  parseLiteral(ast) {
    const result = ast.value;
    return result;
    // return a literal value, such as 1 or 'static string'
  },
});

/*----------------------------------------
 * @constant
 * @type {GraphQLScalarType}
 *----------------------------------------*/
export const baseObject = gql`
type Query {
  objectsByExecID(execution_id: String, case_id: String, limit: Int,): [Object]
  allObjects: [Object]
}

scalar Coordinates

type Geometry {
  type: String
  coordinates: Coordinates
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

/*----------------------------------------
 * @constant
 * @type {Object}
 *----------------------------------------*/
export const objectResolvers = {
  Query: {
    objectsByExecID: async (root, args, context) => {
      const Objects = context.db.collection('objects');
      let token = null;
      let user = null;
      let retval = null;

      const myQuery = {
        randval: { $gte: 0 },
        'provenance.analysis.source': 'computer',
        'provenance.analysis.execution_id': args.execution_id,
        'provenance.image.case_id': args.case_id,
      };
      const results = await Objects.find(myQuery).limit(args.limit).toArray();
      token = getToken(context.req.headers);
      user = getUser(token);
      if (typeof results !== 'undefined' && user.valid) {
        retval = results.map(prepare);
      } else {
        retval = { error: 'Data missing' };
      }
      return retval;
    },
    allObjects: async (root, _, context) => {
      const Objects = context.db.collection('objects');
      return (await Objects.find({ randval: { $gte: 0 }, 'provenance.analysis.source': 'computer' }).limit(1000).toArray()).map(prepare);
    },
  },
};
