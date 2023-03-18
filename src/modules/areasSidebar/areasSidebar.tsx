import React from "react";
import VectorSource from "ol/source/Vector";
import { GeoJSON } from "ol/format";
import VectorLayer from "ol/layer/Vector";
import { useMapLayer } from "../map/mapHooks";
import { PageHeader } from "../pageHeader";

export function AreasSidebar() {
  useMapLayer(
    new VectorLayer({
      source: new VectorSource({
        format: new GeoJSON(),
        url: "/gis-kata/geojson/areas.json",
      }),
    })
  );

  return (
    <>
      <PageHeader>
        <h1>Areas</h1>
      </PageHeader>
      <h2>Areas</h2>
    </>
  );
}
