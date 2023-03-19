import { FeatureCollectionDto, FeatureDto, MultiPolygonDto } from "../geo";
import VectorSource from "ol/source/Vector";
import { Feature } from "ol";
import { MultiPolygon } from "ol/geom";

export function createFeatureSource(
  featureCollection?: FeatureCollectionDto<FeatureDto<MultiPolygonDto>>
) {
  if (!featureCollection) {
    return new VectorSource();
  }
  return new VectorSource({
    features: featureCollection.features.map(
      (f) => new Feature(new MultiPolygon(f.geometry.coordinates))
    ),
  });
}
