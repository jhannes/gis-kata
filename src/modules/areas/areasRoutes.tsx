import React from "react";
import { Loading, useFeatureCollection } from "../geo";
import { AreaFeatureCollectionDto } from "./areas";
import { AreasSidebar } from "./areasSidebar";
import { Route, Routes } from "react-router-dom";
import { SelectedAreaSidebar } from "./selectedAreaSidebar";
import { SchoolFeatureCollectionDto } from "../schools";

function useAreaFeatureCollection(): Loading<AreaFeatureCollectionDto> {
  return useFeatureCollection("/gis-kata/geojson/areas.json");
}

export function AreasRoutes({
  schools,
}: {
  schools: SchoolFeatureCollectionDto;
}) {
  const areaFeatureCollection = useAreaFeatureCollection();

  if (areaFeatureCollection.loading || !areaFeatureCollection.data) {
    return <div>Loading...</div>;
  }

  const areas = areaFeatureCollection.data;
  return (
    <Routes>
      <Route path={"/"} element={<AreasSidebar areas={areas} />} />
      <Route
        path={"/:id"}
        element={<SelectedAreaSidebar schools={schools} areas={areas} />}
      />
      <Route path={"*"} element={<h2>Invalid path</h2>} />
    </Routes>
  );
}
