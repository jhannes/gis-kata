import {
  createSchoolFeature,
  SchoolFeatureCollectionDto,
  SchoolFeatureDto,
  slugify,
} from "./schools";
import { Link, useParams } from "react-router-dom";
import React from "react";
import { PageHeader } from "../pageHeader";
import { useMapFeatureDtoLayer, useMapFit } from "../map";
import { Style } from "ol/style";
import { schoolImageStyle, schoolLabel } from "./schoolStyle";

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
  useMapFeatureDtoLayer(
    schools,
    {
      style: (f) => {
        return new Style({
          text: id === f.getId() ? schoolLabel(f) : undefined,
          image: schoolImageStyle(f, id === f.getId()),
        });
      },
    },
    createSchoolFeature
  );
  useMapFit(school.geometry, { maxZoom: 13, duration: 400 });
  const s = school.properties;
  return (
    <>
      <PageHeader>
        <h2>{s.navn}</h2>
      </PageHeader>
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
