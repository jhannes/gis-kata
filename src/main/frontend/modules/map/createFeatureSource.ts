import {
  FeatureDto,
  GeometryDto,
} from "../../../../../target/generated-sources/openapi-typescript";
import VectorSource from "ol/source/Vector";
import { Feature } from "ol";
import { MultiPolygon, Point } from "ol/geom";

export function geometryFromDto(geometry: GeometryDto) {
  switch (geometry.type) {
    case "MultiPolygon":
      return new MultiPolygon(geometry.coordinates);
    case "Point":
      return new Point(geometry.coordinates as number[]);
    default:
      throw new Error("Not supported geometry type " + geometry.type);
  }
}

export function featureFromDto({ properties, geometry }: FeatureDto) {
  return new Feature({
    ...(properties || {}),
    geometry: geometryFromDto(geometry),
  });
}

export function createFeatureSource(features: Array<FeatureDto>) {
  return new VectorSource({
    features: features.map(featureFromDto),
  });
}
