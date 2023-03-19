import React, { useMemo } from "react";
import VectorLayer from "ol/layer/Vector";
import { useMapLayer } from "../map/mapHooks";
import { MultiPolygonDto, useFeatureCollection } from "../geo";
import { createFeatureSource } from "../map";
import { MunicipalityPropertiesDto } from "./areas";
import { AreasSidebar } from "./areasSidebar";

function useAreaFeatureCollection() {
  return useFeatureCollection<MultiPolygonDto, MunicipalityPropertiesDto>(
    "/gis-kata/geojson/areas.json"
  );
}

export function AreasRoutes() {
  const areaFeatureCollection = useAreaFeatureCollection();
  const areaLayer = useMemo(() => {
    return new VectorLayer({
      source: createFeatureSource(areaFeatureCollection.data),
    });
  }, [areaFeatureCollection.data]);

  useMapLayer(areaLayer);

  if (areaFeatureCollection.loading || !areaFeatureCollection.data) {
    return <div>Loading...</div>;
  }

  return (
    <AreasSidebar
      areaFeatureCollection={areaFeatureCollection.data}
    ></AreasSidebar>
  );
}
