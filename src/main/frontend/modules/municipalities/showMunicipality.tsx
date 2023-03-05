import {
  MunicipalityFeatureCollectionDto,
  MunicipalityFeaturePropertiesDto,
} from "../../generated";
import React, { useMemo } from "react";
import { useParams } from "react-router-dom";
import {
  createFeatureSource,
  geometryFromDto,
} from "../map/createFeatureSource";
import { useMapFit, useMapLayer } from "../map";
import VectorLayer from "ol/layer/Vector";
import { Stroke, Style, Text } from "ol/style";

export function ShowMunicipality({
  municipalities,
}: {
  municipalities: MunicipalityFeatureCollectionDto;
}) {
  const { id } = useParams();
  const municipality = municipalities.features.find(
    (m) => m.properties.kommunenummer == id
  )!;
  const location = useMemo(
    () => geometryFromDto(municipality.geometry),
    [municipality]
  );
  useMapLayer(
    new VectorLayer({
      source: createFeatureSource([municipality]),
      style: (feature) => {
        const props =
          feature.getProperties() as MunicipalityFeaturePropertiesDto;
        return new Style({
          stroke: new Stroke({ color: "black" }),
          text: new Text({ text: props.navn, font: "italic 25px Colibri" }),
        });
      },
    }),
    [id]
  );
  useMapFit(location, {
    padding: [50, 50, 50, 50],
  });
  return (
    <h1>
      {municipality.properties.navn} kommune (
      {municipality.properties.kommunenummer})
    </h1>
  );
}
