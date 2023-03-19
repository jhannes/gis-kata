import React from "react";
import { SchoolFeatureCollectionDto } from "./schools";
import { Route, Routes } from "react-router-dom";
import { SelectedSchoolSidebar } from "./selectedSchoolSidebar";
import { SchoolsSidebar } from "./schoolsSidebar";

export function SchoolRoutes({
  schools,
}: {
  schools: SchoolFeatureCollectionDto;
}) {
  return (
    <Routes>
      <Route path={"/"} element={<SchoolsSidebar schools={schools} />} />
      <Route
        path={"/:id"}
        element={<SelectedSchoolSidebar schools={schools} />}
      />
      <Route path={"*"} element={<h2>Invalid path</h2>} />
    </Routes>
  );
}
