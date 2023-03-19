import { PageHeader } from "../pageHeader";
import React, { useMemo } from "react";
import { useMapLayer } from "../map";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { GeoJSON } from "ol/format";
import { useFeatureCollection } from "../geo";
import { sortBy } from "../localization/sortBy";
import { SchoolFeatureDto } from "./schools";

function useSchools() {
  return useFeatureCollection<SchoolFeatureDto>(
    "/gis-kata/geojson/schools.json"
  );
}

export function SchoolsSidebar() {
  const schools = useSchools();
  const schoolsLayer = useMemo(
    () =>
      new VectorLayer({
        source: new VectorSource({
          url: "/gis-kata/geojson/schools.json",
          format: new GeoJSON(),
        }),
      }),
    []
  );
  useMapLayer(schoolsLayer);

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
