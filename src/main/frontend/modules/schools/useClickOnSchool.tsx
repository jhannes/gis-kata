import { useMapFeatureSelect, useMapOverlay } from "../map";
import * as React from "react";
import { DependencyList, useMemo } from "react";
import { Point } from "ol/geom";
import { SchoolFeaturePropertiesDto } from "../../../../../target/generated-sources/openapi-typescript";
import { slugify } from "./slugify";
import { Link } from "react-router-dom";

export function useClickOnSchool(deps: DependencyList = []) {
  const selectedFeatures = useMapFeatureSelect(deps);
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
}
