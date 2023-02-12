import { SchoolFeatureCollectionDto } from "../../generated";
import { Link, useParams } from "react-router-dom";
import { slugify } from "./slugify";
import { Point } from "ol/geom";
import { useMapFit, useMapLayer } from "../map";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { Feature } from "ol";
import * as React from "react";

export function ShowSchool({
  schools,
}: {
  schools: SchoolFeatureCollectionDto;
}) {
  const { id } = useParams();
  const school = schools.features.find(
    (school) => slugify(school.properties) === id
  )!;

  let schoolPoint = new Point(school.geometry.coordinates as number[]);
  useMapLayer(
    new VectorLayer({
      source: new VectorSource({
        features: [
          new Feature({
            ...school.properties,
            geometry: schoolPoint,
          }),
        ],
      }),
    })
  );
  useMapFit(schoolPoint, { maxZoom: 10 });
  return (
    <div>
      <h3>
        <Link to={".."}>Schools »</Link>
      </h3>
      <h2>{school.properties.navn}</h2>
      <ul>
        <li>Antall elever: {school.properties.antall_elever}</li>
        <li>Antall ansatte: {school.properties.antall_ansatte}</li>
        <li>Eierform: {school.properties.eierforhold}</li>
      </ul>
    </div>
  );
}
