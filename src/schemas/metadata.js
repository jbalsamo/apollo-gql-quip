/*----------------------------------------
 * @file Schema and resolvers for Quip 2.x data
 * @module schemas/metadata
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
export const metaObject = gql`
  type Query {
    metadataByExecID(execution_id: String, case_id: String, limit: Int): [Object]
    allMetadata: [Object]
  }

  type Image {
    subject_id: String
    case_id: String
  }

  type Algorithm_params {
    input_type: String
    otsu_ratio: Float
    curvature_weight: Float
    min_size: Int
    max_size: Int
    ms_kernel: Int
    declump_type: Int
    levelset_num_iters: Int
    mpp: Float
    image_width: Int
    image_height: Int
    tile_minx: Int
    tile_miny: Int
    tile_width: Int
    tile_height: Int
    patch_minx: Int
    patch_miny: Int
    patch_width: Int
    patch_height: Int
    output_level: String
    out_file_prefix: String
    subject_id: String
    case_id: String
    analysis_id: String
    analysis_desc: String
  }

  type Provenance {
    analysis_execution_id: String
    study_id: String
    type: String
    algorithm_params: Algorithm_params
  }

  type Metadata {
    _id: String
    color: String
    title: String
    image: Image
    provenance: Provenance
    submit_date: String
    randval: Float
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
    metadataByExecID: async (root, args, context) => {
      const Metadata = context.db.collection('metadata');
      let token = null;
      let user = null;
      let retval = null;

      const myQuery = {
        randval: {
          $gte: 0,
        },
        'provenance.analysis.source': 'computer',
        'provenance.analysis.execution_id': args.execution_id,
        'provenance.image.case_id': args.case_id,
      };
      const results = await Metadata.find(myQuery)
        .limit(args.limit)
        .toArray();
      token = getToken(context.req.headers);
      user = getUser(token);
      if (typeof results !== 'undefined' && user.valid) {
        retval = results.map(prepare);
      } else {
        retval = {
          error: 'Data missing',
        };
      }
      return retval;
    },
    allMetadata: async (root, _, context) => {
      const Metadata = context.db.collection('metadata');
      return (await Metadata.find({
        randval: {
          $gte: 0,
        },
        'provenance.analysis.source': 'computer',
      })
        .limit(1000)
        .toArray()).map(prepare);
    },
  },
};
