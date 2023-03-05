import {
  MunicipalityFeatureCollectionDto,
  MunicipalityFeaturePropertiesDto,
} from "../../generated";
import { PageHeader } from "../pageHeader";
import { Link } from "react-router-dom";
import React from "react";
import { useMapFit, useMapLayer } from "../map";
import VectorLayer from "ol/layer/Vector";
import { createFeatureSource } from "../map/createFeatureSource";
import { Fill, Stroke, Style, Text } from "ol/style";
import { FeatureLike } from "ol/Feature";
import { Point } from "ol/geom";
import { compareByProp } from "../utils/compareByProp";

function municipalityStyle(feature: FeatureLike, resolution: number): Style[] {
  const props = feature.getProperties() as MunicipalityFeaturePropertiesDto;
  let fontSize = 25;
  if (resolution > 1200) {
    fontSize = 11;
  } else if (resolution > 350) {
    fontSize = 15;
  }

  return [
    new Style({
      stroke: new Stroke({
        width: 1,
        color: "blue",
      }),
      text: new Text({
        text: props.navn,
        font: fontSize + "px Calibri,sans-serif",
        fill: new Fill({ color: "red" }),
      }),
    }),
  ];
}

export function ListMunicipalities({
  municipalities,
}: {
  municipalities: MunicipalityFeatureCollectionDto;
}) {
  useMapFit(new Point([15, 66]), {
    maxZoom: 5,
    duration: 400,
  });

  useMapLayer(
    new VectorLayer({
      style: municipalityStyle,
      source: createFeatureSource(municipalities.features),
    })
  );

  return (
    <>
      <PageHeader>
        <h1>Municipalities</h1>
      </PageHeader>
      <h1>{municipalities.features.length} municipalities</h1>
      <ul>
        {municipalities.features
          .sort(compareByProp((m) => m.properties.navn))
          .map(({ properties: { kommunenummer, navn } }) => (
            <li key={kommunenummer}>
              <Link to={`/municipalities/${kommunenummer}`}>{navn}</Link>
            </li>
          ))}
      </ul>
    </>
  );
}
