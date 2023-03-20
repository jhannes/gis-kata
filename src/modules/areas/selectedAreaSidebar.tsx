import { AreaFeatureCollectionDto, AreaFeatureDto } from "./areas";
import { Link, useParams } from "react-router-dom";
import React, {
  MutableRefObject,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  createFeature,
  useMapContext,
  useMapFeatureDtoLayer,
  useMapFit,
} from "../map/";
import { Fill, Stroke, Style, Text } from "ol/style";
import { FeatureLike } from "ol/Feature";
import {
  SchoolFeatureCollectionDto,
  SchoolPropertiesDto,
  slugify,
} from "../schools";
import { sortBy } from "../localization/sortBy";
import { PageHeader } from "../pageHeader";
import { schoolImageStyle } from "../schools/schoolStyle";
import { Layer } from "ol/layer";
import { MapBrowserEvent, Overlay } from "ol";
import { Point } from "ol/geom";
import { Coordinate } from "ol/coordinate";

function useMapFeatureSelect(layerFilter?: (layer: Layer) => boolean) {
  const [selectedFeatures, setSelectedFeatures] = useState<FeatureLike[]>([]);
  const [selectedCoordinate, setSelectedCoordinate] = useState<
    Coordinate | undefined
  >();
  const { map } = useMapContext();
  useEffect(() => {
    setSelectedFeatures([]);
  }, []);

  function handleClick(e: MapBrowserEvent<MouseEvent>) {
    const features = map.getFeaturesAtPixel(e.pixel, {
      layerFilter,
      hitTolerance: 7,
    });
    setSelectedFeatures(features);
    setSelectedCoordinate(
      features.length > 0
        ? (features[0].getGeometry() as Point).getCoordinates()
        : undefined
    );
  }

  useEffect(() => {
    map.on("click", handleClick);
    return () => map.un("click", handleClick);
  }, []);

  return { selectedFeatures, selectedCoordinate };
}
function MapOverlay({
  children,
  position,
}: {
  position: Array<number> | undefined;
  children: React.ReactNode;
}) {
  const { map } = useMapContext();
  const overlay = useMemo(() => new Overlay({}), []);
  const overlayRef = useRef() as MutableRefObject<HTMLDivElement>;
  useEffect(() => overlay.setPosition(position), [position]);
  useEffect(() => {
    overlay.setElement(overlayRef.current);
    map.addOverlay(overlay);
    return () => {
      map.removeOverlay(overlay);
    };
  }, [overlay, overlayRef]);

  return (
    <div id="overlay" ref={overlayRef}>
      {children}
    </div>
  );
}

function SelectedAreaSidebarView({
  areas,
  area,
  schools,
}: {
  areas: AreaFeatureCollectionDto;
  area: AreaFeatureDto;
  schools: SchoolFeatureCollectionDto;
}) {
  const kommunenummer = area.properties.kommunenummer.toString();
  function schoolInArea(s: SchoolPropertiesDto) {
    return parseInt(s.kommunenummer) === area.properties.kommunenummer;
  }

  function style(f: FeatureLike) {
    return new Style({
      stroke: new Stroke({
        color: "#3399CC",
        width: 1.25,
      }),
      fill:
        f.getId() != kommunenummer
          ? new Fill({ color: [255, 255, 255, 0.3] })
          : undefined,
      text: new Text({ text: f.getProperties().navn }),
    });
  }

  function createAreaFeature(f: AreaFeatureDto) {
    const feature = createFeature(f);
    feature.setId(f.properties.kommunenummer.toString());
    return feature;
  }

  useMapFeatureDtoLayer(areas, { style }, createAreaFeature);
  useMapFit(area.geometry, {
    padding: [50, 50, 50, 50],
    duration: 300,
  });
  const schoolLayer = useMapFeatureDtoLayer(schools, {
    style: (f) =>
      new Style({
        image: schoolImageStyle(
          f,
          schoolInArea(f.getProperties() as SchoolPropertiesDto)
        ),
      }),
  });
  const { selectedFeatures, selectedCoordinate } = useMapFeatureSelect(
    (l) => l === schoolLayer
  );

  return (
    <>
      <PageHeader>
        <h2>{area.properties.navn}</h2>
      </PageHeader>
      <MapOverlay position={selectedCoordinate}>
        {selectedFeatures
          .map((f) => f.getProperties() as SchoolPropertiesDto)
          .map((s) => (
            <div id={slugify(s)}>{s.navn}</div>
          ))}
      </MapOverlay>
      <Link to={".."}>..</Link>
      <ul>
        {schools.features
          .map((f) => f.properties)
          .filter(schoolInArea)
          .sort(sortBy((s) => s.navn))
          .map((s) => (
            <li key={slugify(s)}>
              <Link to={`/schools/${slugify(s)}`}>{s.navn}</Link>
            </li>
          ))}
      </ul>
    </>
  );
}

export function SelectedAreaSidebar({
  areas,
  schools,
}: {
  areas: AreaFeatureCollectionDto;
  schools: SchoolFeatureCollectionDto;
}) {
  const { id } = useParams();
  const area = areas.features.find(
    (p) => p.properties.kommunenummer.toString() == id
  );
  if (!area) {
    return <h2>Area not found</h2>;
  }

  return (
    <SelectedAreaSidebarView areas={areas} area={area} schools={schools} />
  );
}
