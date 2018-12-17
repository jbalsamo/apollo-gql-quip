import { gql } from 'apollo-server';
import { prepare } from '../../utill/index';
import { MongoClient } from 'mongodb';

/*---------------------------------------
 *
 */
export const baseObject = gql`
type Query {
  objectsByExecID(execution_id: String, case_id: String, limit: Int,): [Object]
  allObjects: [Object]
}

type NV {
  name: String
  value: Float
}

type Geometry {
  type: String
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
  footprint: Int
  properties: Properties
  provenance: Provenance
  submit_date: String
}

schema {
  query: Query
}
`;

export const objectResolvers = {
  Query: {
    objectsByExecID: async (root, args, context) => {
      let token = null;
      let user = null;
      const myQuery = {
        randval: { $gte: 0 }, 
        'provenance.analysis.source': 'computer', 
        'provenance.analysis.execution_id' : args.execution_id, 
        'provenance.image.case_id': args.case_id 
      };
      var results = await Objects.find(myQuery).limit(args.limit).toArray();
      token = getToken(context.req.headers);
      user = getUser(token);
      clog({ 'user': user});
      clog({'token':token});
      if (typeof results != 'undefined' && user.valid) {
        // clog(results);
        return(results.map(prepare));
      } else {
        throw('Authentication failure!');
        return({'error': 'Data missing'});
      };
    },
    allObjects: async () => {
      return (await Objects.find({ randval: {$gte:0},'provenance.analysis.source': 'computer' }).limit(1000).toArray()).map(prepare);
    }
  },
};