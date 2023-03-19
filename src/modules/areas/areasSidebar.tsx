import React, { useMemo } from "react";
import VectorLayer from "ol/layer/Vector";
import { useMapLayer } from "../map/mapHooks";
import { PageHeader } from "../pageHeader";
import { sortBy } from "../localization/sortBy";
import { MultiPolygonDto, useFeatureCollection } from "../geo";
import { Link } from "react-router-dom";
import { createFeatureSource } from "../map";

interface MunicipalityPropertiesDto {
  navn: string;
  kommunenummer: string;
}

function useAreFeatureCollection() {
  return useFeatureCollection<MultiPolygonDto, MunicipalityPropertiesDto>(
    "/gis-kata/geojson/areas.json"
  );
}

export function AreasSidebar() {
  const areaFeatureCollection = useAreFeatureCollection();
  const areaLayer = useMemo(() => {
    return new VectorLayer({
      source: createFeatureSource(areaFeatureCollection.data),
    });
  }, [areaFeatureCollection.data]);

  useMapLayer(areaLayer);

  return (
    <>
      <PageHeader>
        <h1>Areas</h1>
      </PageHeader>
      <h2>Areas</h2>
      {areaFeatureCollection.loading && <div>Loading</div>}
      {areaFeatureCollection.data && (
        <div>
          {areaFeatureCollection.data.features
            .map((f) => f.properties)
            .sort(sortBy((f) => f.navn))
            .map((f) => (
              <div key={f.kommunenummer}>
                <Link to={`${f.kommunenummer}`}>{f.navn}</Link>
              </div>
            ))}
        </div>
      )}
    </>
  );
}
