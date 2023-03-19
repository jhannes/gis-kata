import {
  SchoolFeatureCollectionDto,
  SchoolFeatureDto,
  slugify,
} from "./schools";
import { Link, useParams } from "react-router-dom";
import React from "react";
import { PageHeader } from "../pageHeader";
import { useMapFit } from "../map";

export function SelectedSchoolSidebar({
  schools,
}: {
  schools: SchoolFeatureCollectionDto;
}) {
  const { id } = useParams();
  const school = schools.features.find((s) => slugify(s.properties) == id);
  if (!school) {
    return <h2>School not found</h2>;
  }

  return <SelectedSchoolSidebarView school={school} />;
}

export function SelectedSchoolSidebarView({
  school,
}: {
  school: SchoolFeatureDto;
}) {
  useMapFit(school.geometry, { maxZoom: 12, duration: 400 });
  const s = school.properties;
  return (
    <>
      <PageHeader>
        <h2>{s.navn}</h2>
      </PageHeader>
      <Link to={".."}>..</Link>
      <ul>
        <li>
          Trinn: {s.laveste_trinn}-{s.hoyeste_trinn}
        </li>
        <li>Antall elever: {s.antall_elever}</li>
        <li>Antall ansatte: {s.antall_ansatte}</li>
        <li>Eierforhold: {s.eierforhold}</li>
      </ul>
    </>
  );
}
