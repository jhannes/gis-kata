import {
  SchoolFeatureCollectionDto,
  SchoolPropertiesDto,
  slugify,
} from "./schools";
import { Link, useParams } from "react-router-dom";
import React from "react";
import { PageHeader } from "../pageHeader";

export function SelectedSchoolSidebar({
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

  return <SelectedSchoolSidebarView school={school} schools={schools} />;
}

export function SelectedSchoolSidebarView({
  school,
  schools,
}: {
  school: SchoolPropertiesDto;
  schools: SchoolFeatureCollectionDto;
}) {
  return (
    <>
      <PageHeader>
        <h2>{school.navn}</h2>
      </PageHeader>
      <Link to={".."}>..</Link>
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
