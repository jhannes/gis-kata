import * as React from "react";
import {
  Dispatch,
  MutableRefObject,
  SetStateAction,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { Feature, Map, MapBrowserEvent, Overlay, View } from "ol";
import { OSM } from "ol/source";
import TileLayer from "ol/layer/Tile";
import { useGeographic } from "ol/proj";
import { vgsLayer } from "./vgsLayer";
import { MultiPoint } from "ol/geom";
import { distance } from "ol/coordinate";

useGeographic();

const backgroundLayer = new TileLayer({ source: new OSM() });

export function MapView({
  onFeatureUnderPointer,
}: {
  onFeatureUnderPointer: Dispatch<
    SetStateAction<Feature<MultiPoint> | undefined>
  >;
}) {
  const mapRef = useRef() as MutableRefObject<HTMLDivElement>;
  const overlayRef = useRef() as MutableRefObject<HTMLDivElement>;
  const [clickedFeatures, setClickedFeatures] = useState<Feature<MultiPoint>[]>(
    []
  );

  function handlePointerMoveOnMap(event: MapBrowserEvent<MouseEvent>) {
    const features = map.getFeaturesAtPixel(event.pixel);
    if (features.length > 0) {
      onFeatureUnderPointer(features[0] as Feature<MultiPoint>);
    } else {
      onFeatureUnderPointer((old) => {
        if (old) {
          const d = distance(
            old.getGeometry()?.getCoordinates()[0]!,
            event.coordinate
          );
          if (d < 0.002) {
            return old;
          }
        }

        return undefined;
      });
    }
    map.getViewport().style.cursor = features.length > 0 ? "pointer" : "";
  }

  function handleClickOnMap(event: MapBrowserEvent<MouseEvent>) {
    setClickedFeatures(
      map.getFeaturesAtPixel(event.pixel, {
        hitTolerance: 10,
      }) as Feature<MultiPoint>[]
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
  const overlay = useMemo(() => {
    return new Overlay({
      positioning: "bottom-center",
      autoPan: true,
    });
  }, []);

  useEffect(() => {
    map.setTarget(mapRef.current);
    return () => map.setTarget(undefined);
  }, [map, mapRef]);
  useEffect(() => {
    overlay.setElement(overlayRef.current);
    map.addOverlay(overlay);
  }, [map, overlayRef]);
  useEffect(() => {
    overlay.setPosition(clickedFeatures[0]?.getGeometry()?.getCoordinates()[0]);
  }, [clickedFeatures]);

  useEffect(() => {
    map.on("pointermove", handlePointerMoveOnMap);
    map.on("click", handleClickOnMap);
    return () => {
      map.un("click", handleClickOnMap);
      map.un("pointermove", handlePointerMoveOnMap);
    };
  }, [map]);

  return (
    <div id="map" ref={mapRef}>
      <div ref={overlayRef} id="vgs-overlay">
        {clickedFeatures.length > 0 &&
          clickedFeatures
            .map((f) => f.getProperties())
            .map((f) => <div key={f.skolenavn}>{f.skolenavn}</div>)}
      </div>
    </div>
  );
}
