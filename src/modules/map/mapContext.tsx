import React, { ReactElement, useContext, useMemo, useState } from "react";
import { Layer } from "ol/layer";
import TileLayer from "ol/layer/Tile";
import { OSM } from "ol/source";
import { View } from "ol";

export const MapContext = React.createContext({
  view: new View(),
  layers: [] as Layer[],
  setLayers: (_: (old: Layer[]) => Layer[]) => {},
});

export function useMapContext() {
  return useContext(MapContext);
}

export function MapContextProvider({ children }: { children: ReactElement }) {
  const view = useMemo(
    () =>
      new View({
        center: [10.754, 59.9115],
        zoom: 5,
      }),
    []
  );
  const backgroundLayer = new TileLayer({
    source: new OSM(),
  });
  const [layers, setLayers] = useState<Layer[]>([backgroundLayer]);
  return (
    <MapContext.Provider value={{ setLayers, layers, view }}>
      {children}
    </MapContext.Provider>
  );
}
