import { Link } from "react-router-dom";
import * as React from "react";
import { useEffect, useState } from "react";
import { PageHeader } from "../pageHeader";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { useMapLayer } from "../map";
import {
  DefaultApi,
  SchoolFeatureCollectionDto,
  SchoolFeaturePropertiesDto,
} from "../../generated";
import { Feature } from "ol";
import { Point } from "ol/geom";

export function ListSchools() {
  const [loading, setLoading] = useState(true);
  const [schools, setSchools] = useState<SchoolFeatureCollectionDto>();
  useEffect(() => {
    (async () => {
      const defaultApi = new DefaultApi();
      setLoading(true);
      setSchools(await defaultApi.listSchoolFeatures());
      setLoading(false);
    })();
  }, []);

  if (loading || !schools) {
    return <div>"Loading ..."</div>;
  }

  return <ShowSchools schools={schools} />;
}

function ShowSchools({ schools }: { schools: SchoolFeatureCollectionDto }) {
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

function slugify(s: SchoolFeaturePropertiesDto) {
  return (
    s.kommunenummer +
    "-" +
    s.navn
      .toLowerCase()
      .replace("æ", "a")
      .replace("ø", "o")
      .replace("å", "a")
      .replace(/ /g, "-")
      .replace(/[^a-z0-9_-]/g, "")
  );
}
