import {
  SchoolFeatureCollectionDto,
  SchoolFeaturePropertiesDto,
} from "../../../../../target/generated-sources/openapi-typescript";
import { useMapFeatureSelect, useMapLayer, useMapOverlay } from "../map";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { Feature } from "ol";
import { Point } from "ol/geom";
import * as React from "react";
import { useMemo } from "react";
import { Link } from "react-router-dom";
import { PageHeader } from "../pageHeader";
import { slugify } from "./slugify";

export function ListSchools({
  schools,
}: {
  schools: SchoolFeatureCollectionDto;
}) {
  useMapLayer(
    new VectorLayer({
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
  const selectedFeatures = useMapFeatureSelect();
  const selectedCoordinate = useMemo(
    () =>
      selectedFeatures.length > 0
        ? (selectedFeatures[0].getGeometry() as Point).getCoordinates()
        : undefined,
    [selectedFeatures]
  );
  useMapOverlay(
    selectedFeatures
      .map((f) => f.getProperties() as SchoolFeaturePropertiesDto)
      .map((s) => (
        <div key={slugify(s)}>
          <h3>{s.navn}</h3>
          <Link to={`/schools/${slugify(s)}`}>Gå til »</Link>
        </div>
      )),
    selectedCoordinate
  );

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
