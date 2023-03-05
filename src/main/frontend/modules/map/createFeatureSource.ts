import {
  FeatureDto,
  GeometryDto,
} from "../../../../../target/generated-sources/openapi-typescript";
import VectorSource from "ol/source/Vector";
import { Feature } from "ol";
import { MultiPolygon, Point } from "ol/geom";

function toGeometry(geometry: GeometryDto) {
  switch (geometry.type) {
    case "MultiPolygon":
      return new MultiPolygon(geometry.coordinates);
    case "Point":
      return new Point(geometry.coordinates as number[]);
    default:
      throw new Error("Not supported geometry type " + geometry.type);
  }
}

export function createFeatureSource(features: Array<FeatureDto>) {
  return new VectorSource({
    features: features.map(
      ({ geometry, properties }) =>
        new Feature({
          ...(properties || {}),
          geometry: toGeometry(geometry),
        })
    ),
  });
}
