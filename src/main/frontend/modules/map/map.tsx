import * as React from "react";
import {
  Dispatch,
  MutableRefObject,
  ReactNode,
  SetStateAction,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Map, View } from "ol";
import { useGeographic } from "ol/proj";
import TileLayer from "ol/layer/Tile";
import { OSM } from "ol/source";

import "ol/ol.css";
import { Layer } from "ol/layer";

useGeographic();

let baseLayer = new TileLayer({ source: new OSM() });
const map = new Map({
  layers: [baseLayer],
  view: new View({
    center: [10, 60],
    zoom: 5,
  }),
});

const MapContext = React.createContext<{
  setFeatureLayers: Dispatch<SetStateAction<Layer[]>>;
}>({
  setFeatureLayers: () => {},
});

export function MapContextProvider({ children }: { children: ReactNode }) {
  const [featureLayers, setFeatureLayers] = useState<Layer[]>([]);
  const layers = useMemo(() => [baseLayer, ...featureLayers], [featureLayers]);

  useEffect(() => {
    map.setLayers(layers);
  }, [layers]);

  return (
    <MapContext.Provider value={{ setFeatureLayers }}>
      {children}
    </MapContext.Provider>
  );
}

export function MapView() {
  const mapRef = useRef() as MutableRefObject<HTMLDivElement>;
  useEffect(() => {
    map.setTarget(mapRef.current);
  }, []);

  return <div id="map" ref={mapRef}></div>;
}

export function useMapLayer(layer: Layer) {
  const { setFeatureLayers } = useContext(MapContext);
  useEffect(() => {
    setFeatureLayers((layers) => [...layers, layer]);
    return () => setFeatureLayers((layers) => layers.filter((l) => l != layer));
  }, []);
}
