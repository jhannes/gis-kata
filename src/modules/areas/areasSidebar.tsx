import { AreaFeatureCollectionDto } from "./areas";
import { PageHeader } from "../pageHeader";
import { sortBy } from "../localization/sortBy";
import { Link } from "react-router-dom";
import React from "react";

export function AreasSidebar({ areas }: { areas: AreaFeatureCollectionDto }) {
  return (
    <>
      <PageHeader>
        <h1>Areas</h1>
      </PageHeader>
      <h2>Areas</h2>
      <div>
        {areas.features
          .map((f) => f.properties)
          .sort(sortBy((f) => f.navn))
          .map((f) => (
            <div key={f.kommunenummer}>
              <Link to={`${f.kommunenummer}`}>{f.navn}</Link>
            </div>
          ))}
      </div>
    </>
  );
}
