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
        
    }
`;
