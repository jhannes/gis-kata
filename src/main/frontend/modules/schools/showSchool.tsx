import {
  SchoolFeatureCollectionDto,
  SchoolFeatureDto,
  SchoolFeaturePropertiesDto,
} from "../../generated";
import { Link, useParams } from "react-router-dom";
import { slugify } from "./slugify";
import { Point } from "ol/geom";
import { useMapFit, useMapLayer } from "../map";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { Feature } from "ol";
import * as React from "react";
import { Circle, Fill, Stroke, Style, Text } from "ol/style";
import { FeatureLike } from "ol/Feature";

function schoolToFeature(school: SchoolFeatureDto) {
  const feature = new Feature({
    ...school.properties,
    geometry: new Point(school.geometry.coordinates as number[]),
  });
  feature.setId(slugify(school.properties as SchoolFeaturePropertiesDto));
  return feature;
}

const selectedStyle = new Style({
  image: new Circle({
    radius: 4,
    stroke: new Stroke({ color: [0, 0, 0, 1] }),
    fill: new Fill({
      color: [255, 0, 0, 0.8],
    }),
  }),
});
const nonSelectedStyleOffentlig = new Style({
  image: new Circle({
    radius: 4,
    stroke: new Stroke({ color: [0, 0, 0, 0.5] }),
    fill: new Fill({
      color: [255, 0, 0, 0.4],
    }),
  }),
});
const nonSelectedStylePrivat = new Style({
  image: new Circle({
    radius: 4,
    stroke: new Stroke({ color: [0, 0, 0, 0.5] }),
    fill: new Fill({
      color: [128, 0, 255, 0.4],
    }),
  }),
});

function textStyle(text: string | string[] | undefined) {
  return new Style({
    text: new Text({
      offsetY: 10,
      text,
      font: "Bold 14px Arial",
    }),
  });
}

export function ShowSchool({
  schools,
}: {
  schools: SchoolFeatureCollectionDto;
}) {
  const { id } = useParams();
  const school = schools.features.find(
    (school) => slugify(school.properties) === id
  )!;

  function style(feature: FeatureLike) {
    const school = feature.getProperties() as SchoolFeaturePropertiesDto;
    if (feature.getId() == id) {
      return [selectedStyle, textStyle(school.navn)];
    }
    return school.eierforhold === "Offentlig"
      ? nonSelectedStyleOffentlig
      : nonSelectedStylePrivat;
  }

  useMapLayer(
    new VectorLayer({
      style,
      source: new VectorSource({
        features: schools.features.map(schoolToFeature),
      }),
    })
  );

  useMapFit(new Point(school.geometry.coordinates as number[]), {
    maxZoom: 10,
  });
  return (
    <div>
      <h3>
        <Link to={".."}>Schools »</Link>
      </h3>
      <h2>{school.properties.navn}</h2>
      <ul>
        <li>Antall elever: {school.properties.antall_elever}</li>
        <li>Antall ansatte: {school.properties.antall_ansatte}</li>
        <li>Eierform: {school.properties.eierforhold}</li>
      </ul>
    </div>
  );
}
