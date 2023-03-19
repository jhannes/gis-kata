import React, { useEffect } from "react";
import { Layer } from "ol/layer";
import { useMapContext } from "./mapContext";
import { MultiPolygonDto } from "../geo";
import { FitOptions } from "ol/View";
import { MultiPolygon, Point } from "ol/geom";

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
