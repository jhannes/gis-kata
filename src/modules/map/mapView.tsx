import * as React from "react";
import { MutableRefObject, useEffect, useMemo, useRef } from "react";

import { Map, View } from "ol";
import { OSM } from "ol/source";
import TileLayer from "ol/layer/Tile";

export function MapView() {
  const mapRef = useRef() as MutableRefObject<HTMLDivElement>;
  const map = useMemo(() => {
    return new Map({
      layers: [new TileLayer({ source: new OSM() })],
      view: new View({
        zoom: 5,
        center: [10.7, 59.7],
      }),
    });
  }, []);

  useEffect(() => {
    map.setTarget(mapRef.current);
    return () => map.setTarget(undefined);
  }, [map, mapRef]);

  return <div id="map" ref={mapRef}></div>;
}
