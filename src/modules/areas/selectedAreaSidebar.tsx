import { AreaFeatureCollectionDto, AreaFeatureDto } from "./areas";
import { Link, useParams } from "react-router-dom";
import React from "react";
import { createFeature, useMapFeatureDtoLayer, useMapFit } from "../map/";
import { Fill, Stroke, Style, Text } from "ol/style";
import { FeatureLike } from "ol/Feature";
import { SchoolFeatureCollectionDto, slugify } from "../schools";
import { sortBy } from "../localization/sortBy";

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
  useMapFeatureDtoLayer(schools);

  return (
    <>
      <Link to={".."}>..</Link>
      <h2>{area.properties.navn}</h2>
      <ul>
        {schools.features
          .map((f) => f.properties)
          .filter((s) => parseInt(s.kommunenummer) === parseInt(kommunenummer))
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
