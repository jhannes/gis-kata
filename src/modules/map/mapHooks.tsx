import React, { useEffect, useMemo } from "react";
import { Layer } from "ol/layer";
import { useMapContext } from "./mapContext";
import { FeatureCollectionDto, FeatureDto, MultiPolygonDto } from "../geo";
import { FitOptions } from "ol/View";
import { MultiPolygon, Point } from "ol/geom";
import VectorLayer from "ol/layer/Vector";
import { createFeatureSource } from "./createFeatureSource";
import { Style } from "ol/style";

export function useMapLayer(layer: Layer) {
  const { setLayers } = useMapContext();
  useEffect(() => {
    if (layer) setLayers((old) => [...old, layer]);
    return () => setLayers((old) => old.filter((l) => l !== layer));
  }, [layer]);
}

export function useMapFit(geometry: MultiPolygonDto, options: FitOptions) {
  const { view } = useMapContext();
  useEffect(() => {
    const center = view.getCenter()!;
    const zoom = view.getZoom();
    view.fit(new MultiPolygon(geometry.coordinates), options);
    return () =>
      view.fit(new Point(center), {
        maxZoom: zoom,
        duration: options.duration,
      });
  }, [geometry, options]);
}

export function useMapFeatureDtoLayer(
  features: FeatureCollectionDto<FeatureDto<MultiPolygonDto>>,
  options: { style?: Style } = {}
) {
  const layer = useMemo(() => {
    return new VectorLayer({
      ...options,
      source: createFeatureSource(features),
    });
  }, [features]);
  useMapLayer(layer);
}
