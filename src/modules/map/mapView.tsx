import * as React from "react";
import { MutableRefObject, useEffect, useMemo, useRef } from "react";
import { Map, View } from "ol";
import TileLayer from "ol/layer/Tile";
import { OSM } from "ol/source";

export function MapView() {
  const mapRef = useRef() as MutableRefObject<HTMLDivElement>;
  const map = useMemo(() => {
    return new Map({
      layers: [new TileLayer({ source: new OSM() })],
      view: new View({
        center: [10.7, 59.9],
        zoom: 5,
      }),
    });
  }, []);

  useEffect(() => map.setTarget(mapRef.current), [map, mapRef]);

  return <div id="map" ref={mapRef} />;
}
