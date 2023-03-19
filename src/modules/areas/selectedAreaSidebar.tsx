import { AreaFeatureCollectionDto, AreaFeatureDto } from "./areas";
import { Link, useParams } from "react-router-dom";
import React from "react";
import { createFeature, useMapFeatureDtoLayer, useMapFit } from "../map/";
import { Fill, Stroke, Style, Text } from "ol/style";
import { FeatureLike } from "ol/Feature";

function SelectedAreaSidebarView({
  areas,
  area,
}: {
  areas: AreaFeatureCollectionDto;
  area: AreaFeatureDto;
}) {
  function style(f: FeatureLike) {
    return new Style({
      stroke: new Stroke({
        color: "#3399CC",
        width: 1.25,
      }),
      fill:
        f.getId() != area.properties.kommunenummer
          ? new Fill({ color: [255, 255, 255, 0.3] })
          : undefined,
      text: new Text({ text: f.getProperties().navn }),
    });
  }

  function createAreaFeature(f: AreaFeatureDto) {
    const feature = createFeature(f);
    feature.setId(f.properties.kommunenummer);
    return feature;
  }

  useMapFeatureDtoLayer(areas, { style }, createAreaFeature);
  useMapFit(area.geometry, {
    padding: [50, 50, 50, 50],
    duration: 300,
  });

  return (
    <>
      <Link to={".."}>..</Link>
      <h2>{area.properties.navn}</h2>
    </>
  );
}

export function SelectedAreaSidebar({
  areas,
}: {
  areas: AreaFeatureCollectionDto;
}) {
  const { id } = useParams();
  const area = areas.features.find(
    (p) => p.properties.kommunenummer.toString() == id
  );
  if (!area) {
    return <h2>Area not found</h2>;
  }

  return <SelectedAreaSidebarView areas={areas} area={area} />;
}
