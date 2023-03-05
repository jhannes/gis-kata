import {
  SchoolFeatureCollectionDto,
  SchoolFeaturePropertiesDto,
} from "../../generated";
import { useMapLayer } from "../map";
import VectorLayer from "ol/layer/Vector";
import * as React from "react";
import { Link } from "react-router-dom";
import { PageHeader } from "../pageHeader";
import { slugify } from "./slugify";
import { useClickOnSchool } from "./useClickOnSchool";
import { schoolCircleStyle } from "./style";
import { createFeatureSource } from "../map/createFeatureSource";

const styleOffentlig = schoolCircleStyle([255, 0, 0]);
const stylePrivat = schoolCircleStyle([128, 0, 255]);

export function ListSchools({
  schools,
}: {
  schools: SchoolFeatureCollectionDto;
}) {
  useMapLayer(
    new VectorLayer({
      style: (feature) => {
        const school = feature.getProperties() as SchoolFeaturePropertiesDto;
        return school.eierforhold === "Offentlig"
          ? styleOffentlig
          : stylePrivat;
      },
      source: createFeatureSource(schools.features),
    })
  );
  useClickOnSchool();

  return (
    <>
      <PageHeader>
        <h1>Schools</h1>
      </PageHeader>
      <h1>{schools.features.length} schools</h1>
      <ul>
        {schools.features
          .sort((a, b) => a.properties.navn.localeCompare(b.properties.navn))
          .map(({ properties: school }) => (
            <li key={slugify(school)}>
              <Link to={`/schools/${slugify(school)}`}>{school.navn}</Link>
            </li>
          ))}
      </ul>
    </>
  );
}
