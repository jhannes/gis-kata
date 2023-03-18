import React, { MutableRefObject, useEffect, useMemo, useRef } from "react";
import { Map } from "ol";

export function MapView() {
  const map = useMemo(() => new Map(), []);
  const mapRef = useRef() as MutableRefObject<HTMLDivElement>;

  useEffect(() => {
    map.setTarget(mapRef.current);
  }, [map, mapRef]);

  return <div id="map" ref={mapRef} />;
}
