import * as React from "react";
import { PageHeader } from "../pageHeader";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { useMapLayer } from "../map";
import { GeoJSON } from "ol/format";

export function ListSchools() {
  useMapLayer(
    new VectorLayer({
      source: new VectorSource({
        url: "/geojson/schools.geojson",
        format: new GeoJSON(),
      }),
    })
  );

  return (
    <>
      <PageHeader>
        <h1>Schools</h1>
      </PageHeader>
      <h1>Schools</h1>
    </>
  );
}
