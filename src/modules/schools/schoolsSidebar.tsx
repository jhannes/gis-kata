import { PageHeader } from "../pageHeader";
import React from "react";
import { useMapFeatureDtoLayer } from "../map";
import { Loading, useFeatureCollection } from "../geo";
import { sortBy } from "../localization/sortBy";
import { SchoolFeatureCollectionDto } from "./schools";

function useSchools(): Loading<SchoolFeatureCollectionDto> {
  return useFeatureCollection("/gis-kata/geojson/schools.json");
}

export function SchoolsSidebar() {
  const schools = useSchools();
  useMapFeatureDtoLayer(schools?.data);

  if (!schools.data) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <PageHeader>
        <h1>Schools</h1>
      </PageHeader>
      <h1>Schools</h1>
      {schools.data.features
        .map((s) => s.properties)
        .sort(sortBy((s) => s.navn))
        .map((f) => (
          <div>{f.navn}</div>
        ))}
    </>
  );
}
