import { Circle, Fill, Stroke, Style, Text } from "ol/style";
import { FeatureLike } from "ol/Feature";

export function customLayerStyle(feature: FeatureLike): Style {
  if (feature.getGeometry()?.getType() === "Point") {
    return new Style({
      image: new Circle({
        radius: 5,
        stroke: new Stroke({
          color: "#3399CC",
          width: 1.25,
        }),
        fill: new Fill({ color: "#3399CC" }),
      }),
      text: new Text({
        text: feature.getProperties().name,
        offsetY: 10,
      }),
    });
  } else {
    return new Style({
      stroke: new Stroke({
        color: "#3399CC",
        width: 1.25,
      }),
      fill: new Fill({ color: [255, 255, 255, 0.3] }),
      text: new Text({
        text: feature.getProperties().name,
      }),
    });
  }
}
