import React from "react";
import { useFeatureCollection } from "../geo";
import { AreaFeatureDto } from "./areas";
import { AreasSidebar } from "./areasSidebar";
import { Route, Routes } from "react-router-dom";
import { SelectedAreaSidebar } from "./selectedAreaSidebar";

function useAreaFeatureCollection() {
  return useFeatureCollection<AreaFeatureDto>("/gis-kata/geojson/areas.json");
}

export function AreasRoutes() {
  const areaFeatureCollection = useAreaFeatureCollection();

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
