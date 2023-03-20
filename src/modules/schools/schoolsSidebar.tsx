import {
  createSchoolFeature,
  SchoolFeatureCollectionDto,
  slugify,
} from "./schools";
import { PageHeader } from "../pageHeader";
import { sortBy } from "../localization/sortBy";
import { Link } from "react-router-dom";
import React from "react";
import { useMapFeatureDtoLayer, useMapFeatureSelect } from "../map";
import { Style } from "ol/style";
import { schoolImageStyle } from "./schoolStyle";
import { SelectedSchoolsOverlay } from "./selectedSchoolsOverlay";

export function SchoolsSidebar({
  schools,
}: {
  schools: SchoolFeatureCollectionDto;
}) {
  const schoolLayer = useMapFeatureDtoLayer(
    schools,
    { style: (f) => new Style({ image: schoolImageStyle(f) }) },
    createSchoolFeature
  );
  const { selectedFeatures, position } = useMapFeatureSelect(
    (l) => l === schoolLayer
  );
  return (
    <>
      <PageHeader>
        <h1>Schools</h1>
      </PageHeader>
      <SelectedSchoolsOverlay position={position} selected={selectedFeatures} />
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
