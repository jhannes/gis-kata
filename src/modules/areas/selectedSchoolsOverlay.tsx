import { FeatureLike } from "ol/Feature";
import { MapOverlay } from "../map";
import { SchoolPropertiesDto, slugify } from "../schools";
import React from "react";

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
          <div id={slugify(s)}>{s.navn}</div>
        ))}
    </MapOverlay>
  );
}
