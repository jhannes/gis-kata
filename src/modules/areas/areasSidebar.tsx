import React, { useEffect, useState } from "react";
import VectorSource from "ol/source/Vector";
import { GeoJSON } from "ol/format";
import VectorLayer from "ol/layer/Vector";
import { useMapLayer } from "../map/mapHooks";
import { PageHeader } from "../pageHeader";
import { sortBy } from "../localization/sortBy";

interface MunicipalityPropertiesDto {
  navn: string;
  kommunenummer: string;
}

export function AreasSidebar() {
  const source = new VectorSource({
    format: new GeoJSON(),
    url: "/gis-kata/geojson/areas.json",
  });
  const [features, setFeatures] = useState<MunicipalityPropertiesDto[]>([]);
  useMapLayer(new VectorLayer({ source }));
  useEffect(() => {
    source.on("change", () => {
      setFeatures(
        source
          .getFeatures()
          .map((f) => f.getProperties() as MunicipalityPropertiesDto)
      );
    });
  }, []);

  return (
    <>
      <PageHeader>
        <h1>Areas</h1>
      </PageHeader>
      <h2>Areas</h2>
      {features.sort(sortBy((f) => f.navn)).map((f) => (
        <div key={f.kommunenummer}>{f.navn}</div>
      ))}
    </>
  );
}
