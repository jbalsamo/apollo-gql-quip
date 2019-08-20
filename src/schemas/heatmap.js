/*----------------------------------------
 * @file Schema and resolvers for Quip 2.x data
 * @module schemas/heatmap
 * @author Joseph Balsamo
 * @version 0.1.0
 *----------------------------------------*/
import { gql } from 'apollo-server';
import { GraphQLScalarType } from 'graphql';
import { prepare } from '../../utill/index';
import { getUser, getToken } from '../helpers';

/*----------------------------------------
 * @constant
 * @type {GraphQLScalarType}
 *----------------------------------------*/
const Data = new GraphQLScalarType({
  name: 'Data',
  description: 'Heatmap data values and coordinate values',
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
export const heatmap = gql`
  type Query {

  }

  scalar Data

  type Image {
    subject_id: String
    case_id: String
    slide: String
    specimen: String
    study: String
  }

  type Field {
    name: String
    range: [ Float ]
    value: [ Float ]
  }

  type Setting {
    mode: String
    field: String
  }

  type Analysis {
    study_id: String
    computation: String
    size: [ Float ]
    fields: [ Field ]
    execution_id: String
    source: String
    setting: Setting
  }

  type Provenance {
    image: Image
    analysis: Analysis
  }

  type Heatmap {
    provenance: Provenance
    data: Data
  }
`;
