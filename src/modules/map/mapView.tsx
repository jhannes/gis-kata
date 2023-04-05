import * as React from "react";
import { MutableRefObject, useEffect, useMemo, useRef } from "react";
import { Map, View } from "ol";
import TileLayer from "ol/layer/Tile";
import { OSM } from "ol/source";
import { useGeographic } from "ol/proj";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { GeoJSON } from "ol/format";
import { Circle, Fill, Stroke, Style, Text } from "ol/style";

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
          style: (feature) => {
            const school = feature.getProperties();
            return new Style({
              text: new Text({
                stroke: new Stroke({ color: "white", width: 2 }),
                font: "18px sans",
                text: school.skolenavn?.substring(0, 20),
                offsetY: 15,
              }),
              image: new Circle({
                radius: 6,
                stroke: new Stroke({ color: "black" }),
                fill:
                  school.eierforh === "Privat"
                    ? new Fill({ color: "purple" })
                    : new Fill({ color: "blue" }),
              }),
            });
          },
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

  return <div id="map" ref={mapRef} />;
}
