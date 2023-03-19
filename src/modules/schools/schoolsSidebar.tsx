import { SchoolFeatureCollectionDto, slugify } from "./schools";
import { PageHeader } from "../pageHeader";
import { sortBy } from "../localization/sortBy";
import { Link } from "react-router-dom";
import React from "react";
import { createFeature, useMapFeatureDtoLayer } from "../map";
import { Circle, Fill, Stroke, Style } from "ol/style";

export function SchoolsSidebar({
  schools,
}: {
  schools: SchoolFeatureCollectionDto;
}) {
  useMapFeatureDtoLayer(
    schools,
    {
      style: (f) =>
        new Style({
          image: new Circle({
            radius: 5,
            stroke: new Stroke({ color: "black" }),
            fill:
              f.getProperties().eierforhold === "Offentlig"
                ? new Fill({ color: [0, 0, 255, 0.4] })
                : new Fill({ color: [128, 0, 128, 0.4] }),
          }),
        }),
    },
    (s) => {
      const feature = createFeature(s);
      feature.setId(slugify(s.properties));
      return feature;
    }
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
