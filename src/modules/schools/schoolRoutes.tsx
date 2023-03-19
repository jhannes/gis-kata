import React from "react";
import { useMapFeatureDtoLayer } from "../map";
import { Loading, useFeatureCollection } from "../geo";
import { SchoolFeatureCollectionDto } from "./schools";
import { Route, Routes } from "react-router-dom";
import { SelectedSchoolSidebar } from "./selectedSchoolSidebar";
import { SchoolsSidebar } from "./schoolsSidebar";

function useSchools(): Loading<SchoolFeatureCollectionDto> {
  return useFeatureCollection("/gis-kata/geojson/schools.json");
}

export function SchoolRoutes() {
  const schools = useSchools();
  useMapFeatureDtoLayer(schools?.data);

  if (!schools.data) {
    return <div>Loading...</div>;
  }

  return (
    <Routes>
      <Route path={"/"} element={<SchoolsSidebar schools={schools.data} />} />
      <Route
        path={"/:id"}
        element={<SelectedSchoolSidebar schools={schools.data} />}
      />
      <Route path={"*"} element={<h2>Invalid path</h2>} />
    </Routes>
  );
}
