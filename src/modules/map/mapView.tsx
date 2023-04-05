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
import TileLayer from "ol/layer/Tile";
import { OSM } from "ol/source";
import { useGeographic } from "ol/proj";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { GeoJSON } from "ol/format";
import { vgsLayerStyle } from "./vgsLayerStyle";
import { MultiPoint } from "ol/geom";
import { distance } from "ol/coordinate";

useGeographic();

export function MapView({
  onHoverSkole,
}: {
  onHoverSkole: Dispatch<SetStateAction<Feature<MultiPoint> | undefined>>;
}) {
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

  const [selectedSkoleList, setSelectedSkoleList] = useState<
    Feature<MultiPoint>[]
  >([]);
  const overlayPosition = useMemo(() => {
    if (selectedSkoleList.length === 0) {
      return undefined;
    } else {
      return selectedSkoleList[0].getGeometry()?.getCoordinates()[0];
    }
  }, [selectedSkoleList]);

  const overlayRef = useRef() as MutableRefObject<HTMLDivElement>;
  const overlay = useMemo(() => {
    return new Overlay({
      autoPan: true,
      positioning: "bottom-center",
    });
  }, []);
  useEffect(() => {
    overlay.setElement(overlayRef.current);
    map.addOverlay(overlay);
  }, [overlay, overlayRef]);
  useEffect(() => overlay.setPosition(overlayPosition), [overlayPosition]);

  function handleMapClick(event: MapBrowserEvent<MouseEvent>) {
    const features = map.getFeaturesAtPixel(event.pixel, { hitTolerance: 3 });
    setSelectedSkoleList(features as Feature<MultiPoint>[]);
  }

  function handleMapPointer(event: MapBrowserEvent<MouseEvent>) {
    const features = map.getFeaturesAtPixel(event.pixel, { hitTolerance: 3 });
    if (features.length > 0) {
      map.getViewport().style.cursor = "pointer";
      onHoverSkole(features[0] as Feature<MultiPoint>);
    } else {
      map.getViewport().style.cursor = "";
      onHoverSkole((old) => {
        if (old?.getGeometry()) {
          const d = distance(
            event.coordinate,
            old?.getGeometry()?.getCoordinates()[0]!
          );
          if (d < 0.005) {
            return old;
          }
        }
        return undefined;
      });
    }
  }

  useEffect(() => {
    map.on("click", handleMapClick);
    map.on("pointermove", handleMapPointer);
    return () => {
      map.un("pointermove", handleMapPointer);
      map.un("click", handleMapClick);
    };
  }, [map]);

  return (
    <div id="map" ref={mapRef}>
      <div id="overlay" ref={overlayRef}>
        {selectedSkoleList
          .map((s) => s.getProperties())
          .map((skole) => (
            <div key={skole.skolenavn}>
              <h3>{skole.skolenavn}</h3>
            </div>
          ))}
      </div>
    </div>
  );
}
