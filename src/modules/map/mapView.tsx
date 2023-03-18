import React, { MutableRefObject, useEffect, useMemo, useRef } from "react";
import { Map, View } from "ol";
import { OSM } from "ol/source";
import TileLayer from "ol/layer/Tile";
import { useGeographic } from "ol/proj";

useGeographic();

export function MapView() {
  const map = useMemo(
    () =>
      new Map({
        layers: [
          new TileLayer({
            source: new OSM(),
          }),
        ],
        view: new View({
          center: [10.754, 59.9115],
          zoom: 5,
        }),
      }),
    []
  );
  const mapRef = useRef() as MutableRefObject<HTMLDivElement>;

  useEffect(() => {
    map.setTarget(mapRef.current);
  }, [map, mapRef]);

  return <div id="map" ref={mapRef} />;
}
