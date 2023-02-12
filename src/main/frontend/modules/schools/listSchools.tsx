import {
  SchoolFeatureCollectionDto,
  SchoolFeaturePropertiesDto,
} from "../../generated";
import { useMapLayer } from "../map";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { Feature } from "ol";
import { Point } from "ol/geom";
import * as React from "react";
import { Link } from "react-router-dom";
import { PageHeader } from "../pageHeader";
import { slugify } from "./slugify";
import { useClickOnSchool } from "./useClickOnSchool";
import { schoolCircleStyle } from "./style";

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
      source: new VectorSource({
        features: schools.features.map(
          (school) =>
            new Feature({
              ...school.properties,
              geometry: new Point(school.geometry.coordinates as number[]),
            })
        ),
      }),
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
        {schools.features.map(({ properties: school }) => (
          <li key={slugify(school)}>
            <Link to={`/schools/${slugify(school)}`}>{school.navn}</Link>
          </li>
        ))}
      </ul>
    </>
  );
}
