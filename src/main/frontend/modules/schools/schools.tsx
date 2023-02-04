import { Link, Route, Routes, useParams } from "react-router-dom";
import * as React from "react";
import { useEffect, useState } from "react";
import { PageHeader } from "../pageHeader";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { useMapFit, useMapLayer, useMapOverlay } from "../map";
import {
  DefaultApi,
  SchoolFeatureCollectionDto,
  SchoolFeaturePropertiesDto,
} from "../../generated";
import { Feature } from "ol";
import { Point } from "ol/geom";

export function SchoolsRoute() {
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

  return (
    <Routes>
      <Route path={"/:id"} element={<ShowSchool schools={schools} />} />
      <Route path={"/"} element={<ListSchools schools={schools} />} />
    </Routes>
  );
}

function ShowSchool({ schools }: { schools: SchoolFeatureCollectionDto }) {
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
  useMapOverlay(
    <div>
      <h3>{school.properties.navn}</h3>
      <Link to={"/"}>Gå til »</Link>
    </div>,
    school.geometry.coordinates as number[]
  );

  return (
    <div>
      <h2>{school.properties.navn}</h2>
      <ul>
        <li>Antall elever: {school.properties.antall_elever}</li>
        <li>Antall ansatte: {school.properties.antall_ansatte}</li>
        <li>Eierform: {school.properties.eierforhold}</li>
      </ul>
    </div>
  );
}

function ListSchools({ schools }: { schools: SchoolFeatureCollectionDto }) {
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
