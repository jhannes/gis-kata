import { AreaFeatureCollectionDto } from "./areas";
import { useParams } from "react-router-dom";
import React from "react";

export function SelectedAreaSidebar(props: {
  areas: AreaFeatureCollectionDto;
}) {
  const { id } = useParams();
  const area = props.areas.features.find(
    (p) => p.properties.kommunenummer == id
  );
  if (!area) {
    return <h2>Area not found</h2>;
  }

  return <h2>{area.properties.navn}</h2>;
}
