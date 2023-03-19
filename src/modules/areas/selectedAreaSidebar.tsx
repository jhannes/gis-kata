import { AreaFeatureCollectionDto, AreaFeatureDto } from "./areas";
import { Link, useParams } from "react-router-dom";
import React from "react";
import { useMapFeatureDtoLayer, useMapFit } from "../map/";
import { Stroke, Style } from "ol/style";

function SelectedAreaSidebarView({
  areas,
  area,
}: {
  areas: AreaFeatureCollectionDto;
  area: AreaFeatureDto;
}) {
  useMapFeatureDtoLayer(areas, {
    style: new Style({
      stroke: new Stroke({
        color: "black",
      }),
    }),
  });
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
  const area = areas.features.find((p) => p.properties.kommunenummer == id);
  if (!area) {
    return <h2>Area not found</h2>;
  }

  return <SelectedAreaSidebarView areas={areas} area={area} />;
}
