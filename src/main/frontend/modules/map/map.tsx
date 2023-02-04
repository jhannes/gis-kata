import * as React from "react";
import {
  Dispatch,
  MutableRefObject,
  ReactElement,
  ReactNode,
  SetStateAction,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Map, Overlay, View } from "ol";
import { useGeographic } from "ol/proj";
import TileLayer from "ol/layer/Tile";
import { OSM } from "ol/source";

import "ol/ol.css";
import { Layer } from "ol/layer";
import { SimpleGeometry } from "ol/geom";
import { FitOptions } from "ol/View";
import { MousePosition, OverviewMap, Zoom } from "ol/control";

useGeographic();

let baseLayer = new TileLayer({ source: new OSM() });
const overlay = new Overlay({});
const map = new Map({
  layers: [baseLayer],
  overlays: [overlay],
  controls: [new Zoom(), new MousePosition({}), new OverviewMap()],
  view: new View({
    center: [10, 60],
    zoom: 5,
  }),
});

const MapContext = React.createContext<{
  setFeatureLayers: Dispatch<SetStateAction<Layer[]>>;
  setOverlayPosition: Dispatch<SetStateAction<number[] | undefined>>;
  overlayContent?: ReactElement;
  setOverlayContent: Dispatch<SetStateAction<ReactElement | undefined>>;
}>({
  setFeatureLayers: () => {},
  setOverlayPosition: () => {},
  setOverlayContent: () => {},
});

export function MapContextProvider({ children }: { children: ReactNode }) {
  const [featureLayers, setFeatureLayers] = useState<Layer[]>([]);
  const layers = useMemo(() => [baseLayer, ...featureLayers], [featureLayers]);
  useEffect(() => {
    map.setLayers(layers);
  }, [layers]);

  const [overlayPosition, setOverlayPosition] = useState<
    number[] | undefined
  >();
  const [overlayContent, setOverlayContent] = useState<
    ReactElement | undefined
  >();
  useEffect(() => {
    overlay.setPosition(overlayPosition);
  }, [overlayPosition]);

  return (
    <MapContext.Provider
      value={{
        setFeatureLayers,
        setOverlayPosition,
        setOverlayContent,
        overlayContent,
      }}
    >
      {children}
    </MapContext.Provider>
  );
}

export function MapView() {
  const { overlayContent } = useContext(MapContext);

  const mapRef = useRef() as MutableRefObject<HTMLDivElement>;
  const overlayRef = useRef() as MutableRefObject<HTMLDivElement>;
  useEffect(() => {
    map.setTarget(mapRef.current);
    overlay.setElement(overlayRef.current);
  }, []);

  return (
    <>
      <div id="map" ref={mapRef}></div>
      <div id="overlay" ref={overlayRef}>
        {overlayContent}
      </div>
    </>
  );
}

export function useMapLayer(layer: Layer) {
  const { setFeatureLayers } = useContext(MapContext);
  useEffect(() => {
    setFeatureLayers((layers) => [...layers, layer]);
    return () => setFeatureLayers((layers) => layers.filter((l) => l != layer));
  }, []);
}

export function useMapFit(target: SimpleGeometry, options: FitOptions) {
  map.getView().fit(target, options);
}

export function useMapOverlay(children: ReactElement, position: number[]) {
  const { setOverlayPosition, setOverlayContent } = useContext(MapContext);
  useEffect(() => {
    setOverlayPosition(position);
    setOverlayContent(children);
    return () => {
      setOverlayContent(undefined);
      setOverlayPosition(undefined);
    };
  }, []);
}
