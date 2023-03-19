import React, { useMemo } from "react";
import VectorLayer from "ol/layer/Vector";
import { useMapLayer } from "../map/mapHooks";
import { MultiPolygonDto, useFeatureCollection } from "../geo";
import { createFeatureSource } from "../map";
import { MunicipalityPropertiesDto } from "./areas";
import { AreasSidebar } from "./areasSidebar";
import { Route, Routes } from "react-router-dom";
import { SelectedAreaSidebar } from "./selectedAreaSidebar";

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

  const areas = areaFeatureCollection.data;
  return (
    <Routes>
      <Route path={"/"} element={<AreasSidebar areas={areas} />} />
      <Route path={"/:id"} element={<SelectedAreaSidebar areas={areas} />} />
      <Route path={"*"} element={<h2>Invalid path</h2>} />
    </Routes>
  );
}
