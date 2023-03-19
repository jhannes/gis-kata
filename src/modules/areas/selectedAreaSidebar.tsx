import { AreaFeatureCollectionDto, AreaFeatureDto } from "./areas";
import { Link, useParams } from "react-router-dom";
import React from "react";
import { useMapFit } from "../map/";

function SelectedAreaSidebarView({ area }: { area: AreaFeatureDto }) {
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

  return <SelectedAreaSidebarView area={area} />;
}
