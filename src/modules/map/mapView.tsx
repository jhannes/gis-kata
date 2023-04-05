import * as React from "react";
import { MutableRefObject, useEffect, useMemo, useRef, useState } from "react";
import { Map, MapBrowserEvent, Overlay, View } from "ol";
import TileLayer from "ol/layer/Tile";
import { OSM } from "ol/source";
import { useGeographic } from "ol/proj";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { GeoJSON } from "ol/format";
import { vgsLayerStyle } from "./vgsLayerStyle";
import { MultiPoint } from "ol/geom";
import { Coordinate } from "ol/coordinate";

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

  const overlayRef = useRef() as MutableRefObject<HTMLDivElement>;
  const overlay = useMemo(() => new Overlay({}), []);
  useEffect(() => {
    overlay.setElement(overlayRef.current);
    map.addOverlay(overlay);
  }, [overlay, overlayRef]);
  const [overlayPos, setOverlayPos] = useState<Coordinate | undefined>();
  useEffect(() => overlay.setPosition(overlayPos), [overlay, overlayPos]);

  function handleMapClick(event: MapBrowserEvent<MouseEvent>) {
    const features = map.getFeaturesAtPixel(event.pixel, { hitTolerance: 3 });
    if (features.length > 0) {
      const coordinates = (
        features[0].getGeometry() as MultiPoint
      ).getCoordinates()[0];
      setOverlayPos(coordinates);
    } else {
      setOverlayPos(undefined);
    }
  }

  useEffect(() => {
    map.on("click", handleMapClick);
    return () => map.un("click", handleMapClick);
  }, [map]);

  return (
    <div id="map" ref={mapRef}>
      <div id="overlay" ref={overlayRef}>
        This is the overlay
      </div>
    </div>
  );
}
