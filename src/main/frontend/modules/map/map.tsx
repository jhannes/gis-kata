import * as React from "react";
import {
  DependencyList,
  MutableRefObject,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Map, MapBrowserEvent, MapEvent, Overlay, View } from "ol";
import { useGeographic } from "ol/proj";
import TileLayer from "ol/layer/Tile";
import { OSM } from "ol/source";

import "ol/ol.css";
import { Layer } from "ol/layer";
import { SimpleGeometry } from "ol/geom";
import { FitOptions } from "ol/View";
import { MousePosition, OverviewMap, Zoom } from "ol/control";
import { FeatureLike } from "ol/Feature";
import { BaseLayerSelector } from "./baseLayerSelectControl";
import { MapContext } from "./mapContext";
import { layersDefinitions } from "./layersDefinitions";

useGeographic();

export function MapContextProvider({ children }: { children: ReactNode }) {
  const [featureLayers, setFeatureLayers] = useState<Layer[]>([]);
  const [baseLayer, setBaseLayer] = useState<Layer>(
    () =>
      new TileLayer({
        source: new OSM(),
      })
  );

  const overlay = useMemo(() => new Overlay({}), []);
  const map = useMemo(
    () =>
      new Map({
        overlays: [overlay],
        controls: [new Zoom(), new MousePosition({}), new OverviewMap()],
      }),
    []
  );
  const viewPort = useMapViewPort(map, { center: [10.5, 59.5], zoom: 10 });

  const projection = useMemo(() => {
    return baseLayer.getSource()?.getProjection() || undefined;
  }, [baseLayer]);
  const view = useMemo(
    () => new View({ ...viewPort, projection }),
    [projection, viewPort]
  );
  useEffect(() => map.setView(view), [view]);

  const layers = useMemo(
    () => [baseLayer, ...featureLayers],
    [featureLayers, baseLayer]
  );
  useEffect(() => map.setLayers(layers), [layers]);

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
        map,
        overlay,
        setBaseLayer,
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
  const { overlayContent, map, overlay } = useContext(MapContext);

  const mapRef = useRef() as MutableRefObject<HTMLDivElement>;
  const overlayRef = useRef() as MutableRefObject<HTMLDivElement>;
  useEffect(() => {
    map!.setTarget(mapRef.current);
    overlay!.setElement(overlayRef.current);
  }, []);

  return (
    <>
      <div id="map" ref={mapRef} style={{ position: "relative" }}>
        <BaseLayerSelector layerDefinitions={layersDefinitions} />
      </div>
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
  const { map } = useContext(MapContext);
  useEffect(() => {
    setSelectedFeatures([]);
  }, deps);

  function handleClick(e: MapBrowserEvent<MouseEvent>) {
    setSelectedFeatures(
      map!.getFeaturesAtPixel(e.pixel, {
        hitTolerance: 7,
      })
    );
  }

  useEffect(() => {
    map!.on("click", handleClick);
    return () => map!.un("click", handleClick);
  }, []);

  return selectedFeatures;
}

export function useMapFit(target: SimpleGeometry, options: FitOptions) {
  const { map } = useContext(MapContext);
  useEffect(() => map!.getView().fit(target, options), [target]);
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

function useMapViewPort(
  map: Map,
  defaultViewport: { center: number[]; zoom: number }
) {
  function handleMoveend(event: MapEvent) {
    const view = event.map.getView();
    sessionStorage.setItem(
      "viewport",
      JSON.stringify({ center: view.getCenter(), zoom: view.getZoom() })
    );
  }

  useEffect(() => {
    map.on("moveend", handleMoveend);
    return () => map.un("moveend", handleMoveend);
  }, [map]);

  const viewport = useMemo(() => {
    const savedViewport = sessionStorage.getItem("viewport");
    return savedViewport ? JSON.parse(savedViewport) : defaultViewport;
  }, []);
  return viewport;
}
