import * as React from "react";
import { MutableRefObject, useEffect, useMemo, useRef } from "react";
import { Map, MapBrowserEvent, View } from "ol";
import TileLayer from "ol/layer/Tile";
import { OSM } from "ol/source";
import { useGeographic } from "ol/proj";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { GeoJSON } from "ol/format";
import { vgsLayerStyle } from "./vgsLayerStyle";

useGeographic();

export function MapView() {
  const mapRef = useRef() as MutableRefObject<HTMLDivElement>;
  const map = useMemo(() => {
    return new Map({
      layers: [
        new TileLayer({ source: new OSM() }),
        new VectorLayer({
          source: new VectorSource({
            url: "/geojson/vgs.json",
            format: new GeoJSON(),
          }),
          style: vgsLayerStyle,
        }),
      ],
      view: new View({
        center: [10.74, 59.92],
        zoom: 14,
      }),
    });
  }, []);

  useEffect(() => {
    map.setTarget(mapRef.current);
    return () => map.setTarget(undefined);
  }, [map, mapRef]);

  function handleVgsClick(event: MapBrowserEvent<MouseEvent>) {
    const features = map.getFeaturesAtPixel(event.pixel, {
      hitTolerance: 3,
    });
    console.log({ features });
  }

  useEffect(() => {
    map.on("click", handleVgsClick);
    return () => map.un("click", handleVgsClick);
  }, [map]);

  return <div id="map" ref={mapRef} />;
}
