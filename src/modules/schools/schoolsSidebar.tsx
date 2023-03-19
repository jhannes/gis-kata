import { SchoolFeatureCollectionDto, slugify } from "./schools";
import { PageHeader } from "../pageHeader";
import { sortBy } from "../localization/sortBy";
import { Link } from "react-router-dom";
import React from "react";

export function SchoolsSidebar({ schools }: { schools: SchoolFeatureCollectionDto }) {
  return (
    <>
      <PageHeader>
        <h1>Schools</h1>
      </PageHeader>
      <h1>Schools</h1>
      {schools.features
        .map((s) => s.properties)
        .sort(sortBy((s) => s.navn))
        .map((f) => (
          <div>
            <Link to={slugify(f)}>{f.navn}</Link>
          </div>
        ))}
    </>
  );
}