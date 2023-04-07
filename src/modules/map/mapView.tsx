import * as React from "react";
import { MutableRefObject, useEffect, useMemo, useRef, useState } from "react";

import { Feature, Map, MapBrowserEvent, View } from "ol";
import { OSM } from "ol/source";
import TileLayer from "ol/layer/Tile";
import { useGeographic } from "ol/proj";
import { vgsLayer } from "./vgsLayer";
import { MultiPoint } from "ol/geom";

useGeographic();

const backgroundLayer = new TileLayer({ source: new OSM() });

export function MapView({
  onFeatureUnderPointer,
}: {
  onFeatureUnderPointer: (value?: Feature<MultiPoint>) => void;
}) {
  const mapRef = useRef() as MutableRefObject<HTMLDivElement>;
  const [clickedFeatures, setClickedFeatures] = useState<Feature<MultiPoint>[]>(
    []
  );

  function handlePointerMoveOnMap(event: MapBrowserEvent<MouseEvent>) {
    const features = map.getFeaturesAtPixel(event.pixel);
    onFeatureUnderPointer(
      features.length > 0 ? (features[0] as Feature<MultiPoint>) : undefined
    );
  }

  function handleClickOnMap(event: MapBrowserEvent<MouseEvent>) {
    setClickedFeatures(
      map.getFeaturesAtPixel(event.pixel) as Feature<MultiPoint>[]
    );
  }

  const map = useMemo(() => {
    return new Map({
      layers: [backgroundLayer, vgsLayer],
      view: new View({
        zoom: 14,
        center: [10.8, 59.93],
      }),
    });
  }, []);

  useEffect(() => {
    map.setTarget(mapRef.current);
    return () => map.setTarget(undefined);
  }, [map, mapRef]);

  useEffect(() => {
    map.on("pointermove", handlePointerMoveOnMap);
    map.on("click", handleClickOnMap);
    return () => {
      map.un("click", handleClickOnMap);
      map.un("pointermove", handlePointerMoveOnMap);
    };
  }, [map]);

  return <div id="map" ref={mapRef}></div>;
}
