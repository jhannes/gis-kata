import {
  createSchoolFeature,
  SchoolFeatureCollectionDto,
  SchoolFeatureDto,
  slugify,
} from "./schools";
import { Link, useParams } from "react-router-dom";
import React from "react";
import { PageHeader } from "../pageHeader";
import { useMapFeatureDtoLayer, useMapFeatureSelect, useMapFit } from "../map";
import { schoolStyle } from "./schoolStyle";
import { SelectedSchoolsOverlay } from "./selectedSchoolsOverlay";

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

  return <SelectedSchoolSidebarView school={school} schools={schools} />;
}

export function SelectedSchoolSidebarView({
  schools,
  school,
}: {
  schools: SchoolFeatureCollectionDto;
  school: SchoolFeatureDto;
}) {
  const id = slugify(school.properties);
  const schoolLayer = useMapFeatureDtoLayer(
    schools,
    {
      style: (f) => schoolStyle(f, id === f.getId()),
    },
    createSchoolFeature,
    [id]
  );
  useMapFit(school.geometry, { maxZoom: 13, duration: 400 });
  const { selectedFeatures, position } = useMapFeatureSelect(
    (l) => l === schoolLayer
  );

  const s = school.properties;
  return (
    <>
      <PageHeader>
        <h2>{s.navn}</h2>
      </PageHeader>
      <SelectedSchoolsOverlay position={position} selected={selectedFeatures} />
      <Link to={`/areas/${parseInt(s.kommunenummer)}`}>..</Link>
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
