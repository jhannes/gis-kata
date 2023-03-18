import React, { useEffect } from "react";
import { Layer } from "ol/layer";
import { useMapContext } from "./mapContext";

export function useMapLayer(layer: Layer) {
  const { setLayers } = useMapContext();
  useEffect(() => {
    setLayers((old) => [...old, layer]);
    return () => setLayers((old) => old.filter((l) => l !== layer));
  }, []);
}
