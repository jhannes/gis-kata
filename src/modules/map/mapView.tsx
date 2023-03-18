import React, { MutableRefObject, useEffect, useMemo, useRef } from "react";
import { Map, View } from "ol";
import { useGeographic } from "ol/proj";
import { useMapContext } from "./mapContext";

useGeographic();

export function MapView() {
  const { layers } = useMapContext();
  const map = useMemo(
    () =>
      new Map({
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
  useEffect(() => map.setLayers(layers), [layers]);

  return <div id="map" ref={mapRef} />;
}
