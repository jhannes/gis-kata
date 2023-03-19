import { PageHeader } from "../pageHeader";
import React, { useMemo } from "react";
import { useMapLayer } from "../map/mapHooks";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { GeoJSON } from "ol/format";

export function SchoolsSidebar() {
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

  return (
    <>
      <PageHeader>
        <h1>Schools</h1>
      </PageHeader>
      <h1>Schools</h1>
    </>
  );
}
