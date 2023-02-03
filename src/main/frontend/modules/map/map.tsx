import * as React from "react";
import { MutableRefObject, ReactNode, useEffect, useRef } from "react";
import { Map, View } from "ol";
import { useGeographic } from "ol/proj";
import TileLayer from "ol/layer/Tile";
import { OSM } from "ol/source";

import "ol/ol.css";

useGeographic();

const map = new Map({
  layers: [new TileLayer({ source: new OSM() })],
  view: new View({
    center: [10, 60],
    zoom: 5,
  }),
});

const MapContext = React.createContext<{}>({});

export function MapContextProvider({ children }: { children: ReactNode }) {
  return <MapContext.Provider value={{}}>{children}</MapContext.Provider>;
}

export function MapView() {
  const mapRef = useRef() as MutableRefObject<HTMLDivElement>;
  useEffect(() => {
    map.setTarget(mapRef.current);
  }, []);
  return <div id="map" ref={mapRef}></div>;
}
