import React, { ReactElement, useContext, useState } from "react";
import { Layer } from "ol/layer";
import TileLayer from "ol/layer/Tile";
import { OSM } from "ol/source";

export const MapContext = React.createContext({
  layers: [] as Layer[],
  setLayers: (setter: (old: Layer[]) => Layer[]) => {},
});

export function useMapContext() {
  return useContext(MapContext);
}

export function MapContextProvider({ children }: { children: ReactElement }) {
  const backgroundLayer = new TileLayer({
    source: new OSM(),
  });
  const [layers, setLayers] = useState<Layer[]>([backgroundLayer]);
  return (
    <MapContext.Provider value={{ setLayers, layers }}>
      {children}
    </MapContext.Provider>
  );
}
