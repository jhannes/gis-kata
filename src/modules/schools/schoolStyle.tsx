import { Circle, Fill, Icon, Stroke, Style, Text } from "ol/style";
import { FeatureLike } from "ol/Feature";

export function schoolLabel(f: FeatureLike) {
  return new Text({
    text: f.getProperties().navn,
    offsetY: 20,
    font: "14px Arial",
    stroke: new Stroke({ color: "white", width: 1.5 }),
    fill: new Fill({ color: "black" }),
  });
}

export function schoolImageStyle(f: FeatureLike, selected: boolean = false) {
  return new Circle({
    radius: 7,
    stroke: new Stroke({ color: "black" }),
    fill:
      f.getProperties().eierforhold === "Offentlig"
        ? new Fill({ color: [0, 0, 255, selected ? 1 : 0.4] })
        : new Fill({ color: [128, 0, 128, selected ? 1 : 0.4] }),
  });
}

const mortarboardIcon = new Icon({
  src: "/gis-kata/images/mortarboard.png",
  width: 18,
  offset: [0, -11],
});

function selectedSchoolStyle(feature: FeatureLike) {
  return [
    new Style({
      image: new Circle({
        radius: 14,
        stroke: new Stroke({ color: "black" }),
        fill:
          feature.getProperties().eierforhold === "Offentlig"
            ? new Fill({ color: [0, 0, 255, 0.5] })
            : new Fill({ color: [128, 0, 128, 0.5] }),
      }),
    }),
    new Style({ image: mortarboardIcon }),
    new Style({ text: schoolLabel(feature) }),
  ];
}

export function schoolStyle(
  feature: FeatureLike,
  selected: boolean = false
): Style | Style[] {
  if (selected) {
    return selectedSchoolStyle(feature);
  }
  return new Style({
    text: selected ? schoolLabel(feature) : undefined,
    image: schoolImageStyle(feature),
  });
}
