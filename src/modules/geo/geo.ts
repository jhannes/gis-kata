export interface CoordinateReferenceSystemDto {
  type: "name";
  properties: CoordinateReferenceSystemPropertiesDto;
}

export interface CoordinateReferenceSystemPropertiesDto {
  name: CoordinateReferenceSystemPropertiesDtoNameEnum;
}

export const CoordinateReferenceSystemPropertiesDtoNameEnumValues = [
  "urn:ogc:def:crs:EPSG::4326",
  "urn:ogc:def:crs:EPSG::3857",
];

export type CoordinateReferenceSystemPropertiesDtoNameEnum =
  (typeof CoordinateReferenceSystemPropertiesDtoNameEnumValues)[number];

/**
 * GeoJSon Feature collection
 */
export interface FeatureCollectionDto<FEATURE extends FeatureDto> {
  type: "FeatureCollection";
  crs: CoordinateReferenceSystemDto;
  features: Array<FEATURE>;
}

/**
 * GeoJSon Feature
 */
export interface FeatureDto<
  GEO extends GeometryDto = GeometryDto,
  PROP extends object = {}
> {
  type: "Feature";
  id?: number;
  geometry: GEO;
  properties: PROP;
}

export type GeometryDto =
  | ({ type: "Point" } & PointDto)
  | ({ type: "Polygon" } & PolygonDto)
  | ({ type: "MultiPolygon" } & MultiPolygonDto)
  | ({ type: "LineString" } & LineStringDto);

export interface LineStringDto {
  type: "LineString";
  coordinates: Array<Array<number>>;
}

export interface MultiPolygonDto {
  type: "MultiPolygon";
  coordinates: Array<Array<Array<Array<number>>>>;
}

export interface PointDto {
  type: "Point";
  /**
   * Point in 3D space
   */
  coordinates: [number, number, number?];
}

export interface PolygonDto {
  type: "Polygon";
  coordinates: Array<Array<Array<number>>>;
}
