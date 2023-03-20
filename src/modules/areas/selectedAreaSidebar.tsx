import { AreaFeatureCollectionDto, AreaFeatureDto } from "./areas";
import { Link, useParams } from "react-router-dom";
import React from "react";
import {
  createFeature,
  useMapFeatureDtoLayer,
  useMapFeatureSelect,
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
import { SelectedSchoolsOverlay } from "./selectedSchoolsOverlay";

function createAreaFeature(f: AreaFeatureDto) {
  const feature = createFeature(f);
  feature.setId(f.properties.kommunenummer.toString());
  return feature;
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
  const { selectedFeatures, position } = useMapFeatureSelect(
    (l) => l === schoolLayer
  );

  return (
    <>
      <PageHeader>
        <h2>{area.properties.navn}</h2>
      </PageHeader>
      <SelectedSchoolsOverlay position={position} selected={selectedFeatures} />
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
