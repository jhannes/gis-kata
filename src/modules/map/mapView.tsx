import React, { MutableRefObject, ReactNode, useEffect, useRef } from "react";
import { useGeographic } from "ol/proj";
import { useMapContext } from "./mapContext";

useGeographic();

export function MapView({ children }: { children?: ReactNode }) {
  const { layers, view, map } = useMapContext();
  const mapRef = useRef() as MutableRefObject<HTMLDivElement>;

  useEffect(() => map.setTarget(mapRef.current), [map, mapRef]);
  useEffect(() => map.setLayers(layers), [layers]);
  useEffect(() => map.setView(view), [view]);

  return (
    <div id="map" ref={mapRef}>
      {children}
    </div>
  );
}