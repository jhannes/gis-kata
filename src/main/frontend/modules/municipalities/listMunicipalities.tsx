import { MunicipalityFeatureCollectionDto } from "../../generated";
import { PageHeader } from "../pageHeader";
import { Link } from "react-router-dom";
import React from "react";

export function ListMunicipalities({
  municipalities,
}: {
  municipalities: MunicipalityFeatureCollectionDto;
}) {
  return (
    <>
      <PageHeader>
        <h1>Municipalities</h1>
      </PageHeader>
      <h1>{municipalities.features.length} municipalities</h1>
      <ul>
        {municipalities.features
          .sort((a, b) => a.properties.navn.localeCompare(b.properties.navn))
          .map(({ properties: { kommunenummer, navn } }) => (
            <li key={kommunenummer}>
              <Link to={`/municipalities/${kommunenummer}`}>{navn}</Link>
            </li>
          ))}
      </ul>
    </>
  );
}
