import { FeatureLike } from "ol/Feature";
import { MapOverlay } from "../map";
import { SchoolPropertiesDto, slugify } from "../schools";
import React from "react";
import { Link } from "react-router-dom";

export function SelectedSchoolsOverlay({
  position,
  selected,
}: {
  position: Array<number> | undefined;
  selected: FeatureLike[];
}) {
  return (
    <MapOverlay position={position}>
      {selected
        .map((f) => f.getProperties() as SchoolPropertiesDto)
        .map((s) => (
          <div key={slugify(s)}>
            <h3>{s.navn}</h3>
            <Link to={`/schools/${slugify(s)}`}>Gå til »</Link>
          </div>
        ))}
    </MapOverlay>
  );
}
