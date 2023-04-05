import * as React from "react";
import { MutableRefObject, useEffect, useMemo, useRef } from "react";
import { Map } from "ol";

export function MapView() {
  const mapRef = useRef() as MutableRefObject<HTMLDivElement>;
  const map = useMemo(() => new Map(), []);

  useEffect(() => map.setTarget(mapRef.current), [map, mapRef]);

  return <div id="map" ref={mapRef} />;
}
