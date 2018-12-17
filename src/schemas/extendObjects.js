import { gql } from 'apollo-server';
import * as GeoJSON from 'graphql-geojson';

export const linkTypeDefs = gql`
    extend type Geometry {
        coordinates: ${GeoJSON.GeoJSONCoordinates}
    }

    extend type Object {
        geometry: Geometry
    }
`;
