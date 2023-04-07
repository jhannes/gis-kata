import * as React from "react";
import { MutableRefObject, useEffect, useMemo, useRef } from "react";

import { Map, View } from "ol";
import { OSM } from "ol/source";
import TileLayer from "ol/layer/Tile";
import { useGeographic } from "ol/proj";
import { vgsLayer } from "./vgsLayer";

useGeographic();

const backgroundLayer = new TileLayer({ source: new OSM() });

export function MapView() {
  const mapRef = useRef() as MutableRefObject<HTMLDivElement>;
  const map = useMemo(() => {
    return new Map({
      layers: [backgroundLayer, vgsLayer],
      view: new View({
        zoom: 12,
        center: [10.8, 59.93],
      }),
    });
  }, []);

  useEffect(() => {
    map.setTarget(mapRef.current);
    return () => map.setTarget(undefined);
  }, [map, mapRef]);

  return <div id="map" ref={mapRef}></div>;
}
