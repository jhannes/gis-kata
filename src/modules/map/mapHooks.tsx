import React, { useEffect, useMemo } from "react";
import { Layer } from "ol/layer";
import { useMapContext } from "./mapContext";
import { FeatureCollectionDto, FeatureDto, GeometryDto } from "../geo";
import { FitOptions } from "ol/View";
import VectorLayer from "ol/layer/Vector";
import { createFeatureSource, createGeometry } from "./createFeatureSource";
import { StyleLike } from "ol/style/Style";
import { Feature } from "ol";

export function useMapLayer(layer: Layer) {
  const { setLayers } = useMapContext();
  useEffect(() => {
    if (layer) setLayers((old) => [...old, layer]);
    return () => setLayers((old) => old.filter((l) => l !== layer));
  }, [layer]);
}

export function useMapFit(geometry: GeometryDto, options: FitOptions) {
  const { view } = useMapContext();
  useEffect(() => {
    view.fit(createGeometry(geometry), options);
  }, [geometry, options]);
}

export function useMapFeatureDtoLayer<
  GEO extends GeometryDto,
  PROPS extends object
>(
  features: FeatureCollectionDto<GEO, PROPS> | undefined,
  options: { style?: StyleLike } = {},
  fn?: (feature: FeatureDto<GEO, PROPS>) => Feature
) {
  const layer = useMemo(() => {
    return new VectorLayer({
      ...options,
      source: createFeatureSource(features, fn),
    });
  }, [features]);
  useMapLayer(layer);
}
