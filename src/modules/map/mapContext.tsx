import React, {
  MutableRefObject,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { Layer } from "ol/layer";
import TileLayer from "ol/layer/Tile";
import { OSM } from "ol/source";
import { Map, Overlay, View } from "ol";

export const MapContext = React.createContext({
  map: new Map(),
  view: new View(),
  layers: [] as Layer[],
  setBackgroundLayer: (_: Layer) => {},
  setFeatureLayers: (_: (old: Layer[]) => Layer[]) => {},
  setOverlay: (
    _: { position: undefined } | { position: number[]; children: ReactNode }
  ) => {},
});

export function useMapContext() {
  return useContext(MapContext);
}

export function MapContextProvider({ children }: { children: ReactNode }) {
  const map = useMemo(() => new Map({}), []);
  const [view, setView] = useState(
    new View({ center: [10.754, 59.9115], zoom: 5 })
  );

  const [backgroundLayer, setBackgroundLayer] = useState<Layer>(
    () => new TileLayer({ source: new OSM() })
  );
  const [featureLayers, setFeatureLayers] = useState<Layer[]>([]);
  const layers = useMemo(
    () => [backgroundLayer, ...featureLayers],
    [backgroundLayer, featureLayers]
  );

  const projection = useMemo(() => {
    return backgroundLayer.getSource()?.getProjection() || undefined;
  }, [backgroundLayer]);
  useEffect(
    () =>
      setView(
        (v) =>
          new View({
            center: v.getCenter(),
            zoom: v.getZoom(),
            projection,
          })
      ),
    [projection]
  );

  const overlay = useMemo(() => new Overlay({}), []);
  const overlayRef = useRef() as MutableRefObject<HTMLDivElement>;
  const [overlayPosition, setOverlayPosition] = useState<
    number[] | undefined
  >();
  useEffect(() => overlay.setPosition(overlayPosition), [overlayPosition]);
  const [overlayContent, setOverlayContent] = useState<ReactNode | undefined>();
  useEffect(() => {
    overlay.setElement(overlayRef.current);
    map.addOverlay(overlay);
  }, [overlay, overlayRef]);

  function setOverlay(
    props: { position: undefined } | { position: number[]; children: ReactNode }
  ) {
    if (props.position) {
      setOverlayPosition(props.position);
      setOverlayContent(props.children);
    } else {
      setOverlayPosition(undefined);
      setOverlayContent(undefined);
    }
  }

  return (
    <MapContext.Provider
      value={{
        map,
        setBackgroundLayer,
        setFeatureLayers,
        layers,
        view,
        setOverlay,
      }}
    >
      {children}
      <div id="overlay" ref={overlayRef}>
        {overlayContent}
      </div>
    </MapContext.Provider>
  );
}
