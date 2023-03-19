import { FeatureCollectionDto, FeatureDto, MultiPolygonDto } from "../geo";
import VectorSource from "ol/source/Vector";
import { Feature } from "ol";
import { MultiPolygon } from "ol/geom";

function createGeometry(f: FeatureDto<MultiPolygonDto>) {
  return new MultiPolygon(f.geometry.coordinates);
}

export function createFeature(f: FeatureDto<MultiPolygonDto>) {
  return new Feature({
    ...f.properties,
    geometry: createGeometry(f),
  });
}

export function createFeatureSource<
  FEATURE extends FeatureDto<MultiPolygonDto>
>(
  featureCollection?: FeatureCollectionDto<FEATURE>,
  fn?: (feature: FEATURE) => Feature
) {
  if (!featureCollection) {
    return new VectorSource();
  }
  return new VectorSource({
    features: featureCollection.features.map(fn || createFeature),
  });
}
