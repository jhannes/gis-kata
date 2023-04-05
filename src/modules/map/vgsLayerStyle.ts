import { FeatureLike } from "ol/Feature";
import { Circle, Fill, Stroke, Style, Text } from "ol/style";

const textStroke = new Stroke({ color: "white", width: 2 });

const circleStroke = new Stroke({ color: "black" });
const privatFill = new Fill({ color: "purple" });
const offentligFill = new Fill({ color: "blue" });

export function vgsLayerStyle(feature: FeatureLike, resolution: number) {
  const school = feature.getProperties();
  return new Style({
    text:
      resolution < 10
        ? new Text({
            stroke: textStroke,
            font: "18px sans",
            text: school.skolenavn?.substring(0, 20),
            offsetY: 15,
          })
        : undefined,
    image: new Circle({
      radius: 6,
      stroke: circleStroke,
      fill: school.eierforh === "Privat" ? privatFill : offentligFill,
    }),
  });
}
