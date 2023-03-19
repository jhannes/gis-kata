import React from "react";
import { useMapFeatureDtoLayer } from "../map";
import { Loading, useFeatureCollection } from "../geo";
import { SchoolFeatureCollectionDto, slugify } from "./schools";
import { PageHeader } from "../pageHeader";
import { sortBy } from "../localization/sortBy";
import { Link, Route, Routes, useParams } from "react-router-dom";

function useSchools(): Loading<SchoolFeatureCollectionDto> {
  return useFeatureCollection("/gis-kata/geojson/schools.json");
}

function SchoolsSidebar({ schools }: { schools: SchoolFeatureCollectionDto }) {
  return (
    <>
      <PageHeader>
        <h1>Schools</h1>
      </PageHeader>
      <h1>Schools</h1>
      {schools.features
        .map((s) => s.properties)
        .sort(sortBy((s) => s.navn))
        .map((f) => (
          <div>
            <Link to={slugify(f)}>{f.navn}</Link>
          </div>
        ))}
    </>
  );
}

function SelectedSchoolSidebar({
  schools,
}: {
  schools: SchoolFeatureCollectionDto;
}) {
  const { id } = useParams();
  const school = schools.features
    .map((p) => p.properties)
    .find((s) => slugify(s) == id);
  if (!school) {
    return <h2>School not found</h2>;
  }

  return (
    <>
      <Link to={".."}>..</Link>
      <h2>{school.navn}</h2>
      <ul>
        <li>
          Trinn: {school.laveste_trinn}-{school.hoyeste_trinn}
        </li>
        <li>Antall elever: {school.antall_elever}</li>
        <li>Antall ansatte: {school.antall_ansatte}</li>
        <li>Eierforhold: {school.eierforhold}</li>
      </ul>
    </>
  );
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
