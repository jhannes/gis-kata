import React, {
  MutableRefObject,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { Feature, Map, MapBrowserEvent, Overlay, View } from "ol";
import TileLayer from "ol/layer/Tile";
import { OSM } from "ol/source";
import { useGeographic } from "ol/proj";
import { vgsLayer } from "./vgsLayer";
import { MultiPoint } from "ol/geom";

useGeographic();

export function MapView({
  onHoverOverSchools,
}: {
  onHoverOverSchools: (features: Feature<MultiPoint>[]) => void;
}) {
  const [selectedSchools, setSelectedSchools] = useState<Feature<MultiPoint>[]>(
    []
  );
  const mapRef = useRef() as MutableRefObject<HTMLDivElement>;
  const overlayRef = useRef() as MutableRefObject<HTMLDivElement>;
  const map = useMemo(
    () =>
      new Map({
        layers: [
          new TileLayer({
            source: new OSM(),
          }),
          vgsLayer,
        ],
        view: new View({
          center: [10.8, 59.923],
          zoom: 13,
        }),
      }),
    []
  );
  useEffect(() => {
    map.setTarget(mapRef.current);
    return () => map.setTarget(undefined);
  }, [map, mapRef]);

  const overlay = useMemo(
    () =>
      new Overlay({
        positioning: "bottom-center",
        autoPan: true,
      }),
    []
  );
  useEffect(() => {
    overlay.setElement(overlayRef.current);
    map.addOverlay(overlay);
  }, [map, overlay, overlayRef]);

  function mouseMove(event: MapBrowserEvent<MouseEvent>) {
    const schoolsUnderMouse = map.getFeaturesAtPixel(
      event.pixel
    ) as Feature<MultiPoint>[];

    map.getViewport().style.cursor =
      schoolsUnderMouse.length > 0 ? "pointer" : "";

    onHoverOverSchools(schoolsUnderMouse);
  }

  function mouseClick(event: MapBrowserEvent<MouseEvent>) {
    const clickedSchools = map.getFeaturesAtPixel(
      event.pixel
    ) as Feature<MultiPoint>[];
    setSelectedSchools(clickedSchools);

    overlay.setPosition(
      clickedSchools.length === 0
        ? undefined
        : clickedSchools[0].getGeometry()?.getCoordinates()[0]
    );
  }

  useEffect(() => {
    map.on("pointermove", mouseMove);
    map.on("click", mouseClick);
    return () => {
      map.un("click", mouseClick);
      map.un("pointermove", mouseMove);
    };
  }, [map]);

  return (
    <div id="map" ref={mapRef}>
      <div id="overlay" ref={overlayRef}>
        {selectedSchools.map((school) => (
          <div>{school.getProperties().skolenavn}</div>
        ))}
      </div>
    </div>
  );
}
