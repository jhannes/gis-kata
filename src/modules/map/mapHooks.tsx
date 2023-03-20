import React, { DependencyList, useEffect, useMemo, useState } from "react";
import { Layer } from "ol/layer";
import { useMapContext } from "./mapContext";
import { FeatureCollectionDto, FeatureDto, GeometryDto } from "../geo";
import { FitOptions } from "ol/View";
import VectorLayer from "ol/layer/Vector";
import { createFeatureSource, createGeometry } from "./createFeatureSource";
import { StyleLike } from "ol/style/Style";
import { Feature, MapBrowserEvent } from "ol";
import { FeatureLike } from "ol/Feature";
import { Coordinate } from "ol/coordinate";
import { Point } from "ol/geom";

export function useMapLayer(layer: Layer) {
  const { setLayers } = useMapContext();
  useEffect(() => {
    if (layer) setLayers((old) => [...old, layer]);
    return () => setLayers((old) => old.filter((l) => l !== layer));
  }, [layer]);
}

export function useMapFit(geometry: GeometryDto, options: FitOptions) {
  const { view } = useMapContext();
  useEffect(() => view.fit(createGeometry(geometry), options), [geometry]);
}

export function useMapFeatureDtoLayer<
  GEO extends GeometryDto,
  PROPS extends object
>(
  features: FeatureCollectionDto<GEO, PROPS> | undefined,
  options: { style?: StyleLike } = {},
  fn?: (feature: FeatureDto<GEO, PROPS>) => Feature,
  deps: DependencyList = []
) {
  const layer = useMemo(() => {
    return new VectorLayer({
      ...options,
      source: createFeatureSource(features, fn),
    });
  }, [features, ...deps]);
  useMapLayer(layer);
  return layer;
}

export function useMapFeatureSelect(layerFilter?: (layer: Layer) => boolean) {
  const [selectedFeatures, setSelectedFeatures] = useState<FeatureLike[]>([]);
  const [selectedCoordinate, setSelectedCoordinate] = useState<
    Coordinate | undefined
  >();
  const { map } = useMapContext();
  useEffect(() => {
    setSelectedFeatures([]);
  }, []);

  function handleClick(e: MapBrowserEvent<MouseEvent>) {
    const features = map.getFeaturesAtPixel(e.pixel, {
      layerFilter,
      hitTolerance: 3,
    });
    setSelectedFeatures(features);
    setSelectedCoordinate(
      features.length > 0
        ? (features[0].getGeometry() as Point).getCoordinates()
        : undefined
    );
  }

  useEffect(() => {
    map.on("click", handleClick);
    return () => map.un("click", handleClick);
  }, []);

  return { selectedFeatures, position: selectedCoordinate };
}
