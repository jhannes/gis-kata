import { FeatureCollectionDto, FeatureDto, GeometryDto } from "../geo";
import VectorSource from "ol/source/Vector";
import { Feature } from "ol";
import { MultiPolygon, Point, Polygon } from "ol/geom";

export function createGeometry(geo: GeometryDto) {
  switch (geo.type) {
    case "MultiPolygon":
      return new MultiPolygon(geo.coordinates);
    case "Polygon":
      return new Polygon(geo.coordinates);
    case "Point":
      return new Point(geo.coordinates as number[]);
    default:
      throw new Error("Unimplemented geometry type " + geo.type);
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
