type GeometryType = 'Point' | 'LineString' | 'Polygon';

export const generateGeoJson = (type: GeometryType, coordinates, properties) => {
  return {
    type: 'Feature',
    properties,
    geometry: {
      type,
      coordinates
    }
  };
};
