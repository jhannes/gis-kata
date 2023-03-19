import {
  SchoolFeatureCollectionDto,
  SchoolFeatureDto,
  slugify,
} from "./schools";
import { Link, useParams } from "react-router-dom";
import React from "react";
import { PageHeader } from "../pageHeader";
import { createFeature, useMapFeatureDtoLayer, useMapFit } from "../map";
import { Circle, Fill, Stroke, Style, Text } from "ol/style";

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
  useMapFeatureDtoLayer(schools);
  useMapFeatureDtoLayer(
    schools,
    {
      style: (f) => {
        const opacity = id === f.getId() ? 1 : 0.4;
        const text =
          id === f.getId()
            ? new Text({
                text: f.getProperties().navn,
                offsetY: 10,
                font: "14px Arial",
                stroke: new Stroke({ color: "white", width: 1.5 }),
                fill: new Fill({ color: "black" }),
              })
            : undefined;
        return new Style({
          text,
          image: new Circle({
            radius: 5,
            stroke: new Stroke({ color: "black" }),
            fill:
              f.getProperties().eierforhold === "Offentlig"
                ? new Fill({ color: [0, 0, 255, opacity] })
                : new Fill({ color: [128, 0, 128, opacity] }),
          }),
        });
      },
    },
    (s) => {
      const feature = createFeature(s);
      feature.setId(slugify(s.properties));
      return feature;
    }
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
