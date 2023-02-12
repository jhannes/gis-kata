import * as React from "react";
import {
  DependencyList,
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
import { Map, MapBrowserEvent, Overlay, View } from "ol";
import { useGeographic } from "ol/proj";
import TileLayer from "ol/layer/Tile";
import { OSM } from "ol/source";

import "ol/ol.css";
import { Layer } from "ol/layer";
import { SimpleGeometry } from "ol/geom";
import { FitOptions } from "ol/View";
import { MousePosition, OverviewMap, Zoom } from "ol/control";
import { FeatureLike } from "ol/Feature";

useGeographic();

let baseLayer = new TileLayer({ source: new OSM() });
const overlay = new Overlay({});
const map = new Map({
  layers: [baseLayer],
  overlays: [overlay],
  controls: [new Zoom(), new MousePosition({}), new OverviewMap()],
  view: new View({
    center: [10, 60],
    zoom: 8,
  }),
});

const MapContext = React.createContext<{
  setFeatureLayers: Dispatch<SetStateAction<Layer[]>>;
  setOverlayPosition: Dispatch<SetStateAction<number[] | undefined>>;
  overlayContent?: ReactNode | undefined;
  setOverlayContent: Dispatch<SetStateAction<ReactNode | undefined>>;
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
  const [overlayContent, setOverlayContent] = useState<ReactNode | undefined>();
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

export function useMapLayer(layer: Layer, deps: DependencyList = []) {
  const { setFeatureLayers } = useContext(MapContext);
  useEffect(() => {
    setFeatureLayers((layers) => [...layers, layer]);
    return () => setFeatureLayers((layers) => layers.filter((l) => l != layer));
  }, deps);
}

export function useMapFeatureSelect(deps: DependencyList = []) {
  const [selectedFeatures, setSelectedFeatures] = useState<FeatureLike[]>([]);
  useEffect(() => {
    setSelectedFeatures([]);
  }, deps);

  function handleClick(e: MapBrowserEvent<MouseEvent>) {
    setSelectedFeatures(
      map.getFeaturesAtPixel(e.pixel, {
        hitTolerance: 7,
      })
    );
  }

  useEffect(() => {
    map.on("click", handleClick);
    return () => map.un("click", handleClick);
  }, []);

  return selectedFeatures;
}

export function useMapFit(target: SimpleGeometry, options: FitOptions) {
  useEffect(() => map.getView().fit(target, options), [target]);
}

export function useMapOverlay(
  children: ReactNode | undefined,
  position: number[] | undefined
) {
  const { setOverlayPosition, setOverlayContent } = useContext(MapContext);
  useEffect(() => {
    setOverlayPosition(position);
    setOverlayContent(children);
    return () => {
      setOverlayContent(undefined);
      setOverlayPosition(undefined);
    };
  }, [position]);
}
