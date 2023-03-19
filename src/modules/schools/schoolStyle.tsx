import { Circle, Fill, Stroke, Text } from "ol/style";
import { FeatureLike } from "ol/Feature";

export function schoolLabel(f: FeatureLike) {
  return new Text({
    text: f.getProperties().navn,
    offsetY: 10,
    font: "14px Arial",
    stroke: new Stroke({ color: "white", width: 1.5 }),
    fill: new Fill({ color: "black" }),
  });
}

export function schoolImageStyle(f: FeatureLike, selected: boolean = false) {
  return new Circle({
    radius: 5,
    stroke: new Stroke({ color: "black" }),
    fill:
      f.getProperties().eierforhold === "Offentlig"
        ? new Fill({ color: [0, 0, 255, selected ? 1 : 0.4] })
        : new Fill({ color: [128, 0, 128, selected ? 1 : 0.4] }),
  });
}
