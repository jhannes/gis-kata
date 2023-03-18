import React, { useContext, useEffect } from "react";
import VectorSource from "ol/source/Vector";
import { GeoJSON } from "ol/format";
import VectorLayer from "ol/layer/Vector";
import { Layer } from "ol/layer";

const MapContext = React.createContext({
  setMapLayers: (setter: (old: Layer[]) => Layer[]) => {},
});

function useMapContext() {
  return useContext(MapContext);
}

function useMapLayer(layer: Layer) {
  const { setMapLayers } = useMapContext();
  useEffect(() => {
    setMapLayers((old) => [...old, layer]);
    return () => setMapLayers((old) => old.filter((l) => l !== layer));
  }, []);
}

export function AreasSidebar() {
  useMapLayer(
    new VectorLayer({
      source: new VectorSource({
        format: new GeoJSON(),
        url: "/gis-kata/geojson/areas.json",
      }),
    })
  );

  return <h2>Areas</h2>;
}
