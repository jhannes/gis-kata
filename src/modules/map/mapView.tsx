import React, { MutableRefObject, useEffect, useMemo, useRef } from "react";
import { Map } from "ol";
import { useGeographic } from "ol/proj";
import { useMapContext } from "./mapContext";

useGeographic();

export function MapView() {
  const { layers, view } = useMapContext();
  const map = useMemo(() => new Map(), []);
  const mapRef = useRef() as MutableRefObject<HTMLDivElement>;

  useEffect(() => map.setTarget(mapRef.current), [map, mapRef]);
  useEffect(() => map.setLayers(layers), [layers]);
  useEffect(() => map.setView(view), [view]);

  return <div id="map" ref={mapRef} />;
}
