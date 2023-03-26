import { FeatureCollectionDto, FeatureDto, GeometryDto } from "../geo";
import VectorSource from "ol/source/Vector";
import { Feature } from "ol";
import { LineString, MultiPolygon, Point, Polygon } from "ol/geom";

export function createGeometry(geo: GeometryDto) {
  switch (geo.type) {
    case "LineString":
      return new LineString(geo.coordinates);
    case "MultiPolygon":
      return new MultiPolygon(geo.coordinates);
    case "Point":
      return new Point(geo.coordinates as number[]);
    case "Polygon":
      return new Polygon(geo.coordinates);
  }
}

export function createFeature<GEO extends GeometryDto, PROPS extends object>(
  f: FeatureDto<GEO, PROPS>
) {
  return new Feature({
    ...f.properties,
    geometry: createGeometry(f.geometry),
  });
}

export function createFeatureSource<
  GEO extends GeometryDto,
  PROPS extends object
>(
  featureCollection?: FeatureCollectionDto<GEO, PROPS>,
  fn?: (feature: FeatureDto<GEO, PROPS>) => Feature
) {
  if (!featureCollection) {
    return new VectorSource();
  }
  return new VectorSource({
    features: featureCollection.features.map(fn || createFeature),
  });
}
