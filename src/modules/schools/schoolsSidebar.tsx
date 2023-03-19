import {
  createSchoolFeature,
  SchoolFeatureCollectionDto,
  slugify,
} from "./schools";
import { PageHeader } from "../pageHeader";
import { sortBy } from "../localization/sortBy";
import { Link } from "react-router-dom";
import React from "react";
import { useMapFeatureDtoLayer } from "../map";
import { Style } from "ol/style";
import { schoolImageStyle } from "./schoolStyle";

export function SchoolsSidebar({
  schools,
}: {
  schools: SchoolFeatureCollectionDto;
}) {
  useMapFeatureDtoLayer(
    schools,
    { style: (f) => new Style({ image: schoolImageStyle(f) }) },
    createSchoolFeature
  );
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
