import {
  MunicipalityFeatureCollectionDto,
  MunicipalityFeaturePropertiesDto,
  SchoolFeatureCollectionDto,
  SchoolFeaturePropertiesDto,
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
import { compareByProp } from "../utils/compareByProp";
import { FeatureLike } from "ol/Feature";
import { schoolCircleStyle, textStyle } from "../schools/style";
import { useClickOnSchool } from "../schools/useClickOnSchool";

const styleOffentlig = schoolCircleStyle([255, 0, 0]);
const stylePrivat = schoolCircleStyle([128, 0, 255]);

function schoolStyle(feature: FeatureLike, resolution: number) {
  const school = feature.getProperties() as SchoolFeaturePropertiesDto;
  return resolution < 16
    ? [
        school.eierforhold === "Offentlig" ? styleOffentlig : stylePrivat,
        textStyle(school.navn),
      ]
    : school.eierforhold === "Offentlig"
    ? styleOffentlig
    : stylePrivat;
}

export function ShowMunicipality({
  municipalities,
  schools,
}: {
  municipalities: MunicipalityFeatureCollectionDto;
  schools: SchoolFeatureCollectionDto;
}) {
  const { id } = useParams();
  const municipality = municipalities.features.find(
    (m) => m.properties.kommunenummer == id
  )!;
  const location = useMemo(
    () => geometryFromDto(municipality.geometry),
    [municipality]
  );

  const schoolsInView = schools.features.filter((s) =>
    s.properties.kommunenummer.endsWith(id || "xxx")
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
  useMapLayer(
    new VectorLayer({
      source: createFeatureSource(schoolsInView),
      style: schoolStyle,
    })
  );
  useMapFit(location, {
    padding: [50, 50, 50, 50],
  });
  useClickOnSchool();
  return (
    <>
      <h1>
        {municipality.properties.navn} kommune (
        {municipality.properties.kommunenummer})
      </h1>
      <h2>Skoler</h2>
      <ul>
        {schoolsInView
          .sort(compareByProp((school) => school.properties.navn))
          .map((s) => (
            <li>{s.properties.navn}</li>
          ))}
      </ul>
    </>
  );
}
