import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { GeoJSON } from "ol/format";
import { Circle, Fill, Stroke, Style, Text } from "ol/style";
import { FeatureLike } from "ol/Feature";

const offentligFill = new Fill({ color: "blue" });
const privatFill = new Fill({ color: "purple" });
const textStroke = new Stroke({ color: "white", width: 2 });

function style(feature: FeatureLike, resolution: number) {
  return new Style({
    image: new Circle({
      radius: resolution < 8 ? 10 : resolution < 100 ? 5 : 2,
      fill:
        feature.getProperties().eierforh === "Offentlig"
          ? offentligFill
          : privatFill,
    }),
    text:
      resolution < 10
        ? new Text({
            text: feature.getProperties().skolenavn?.substring(0, 20),
            font: "14pt bold sans",
            stroke: textStroke,
            offsetY: 10,
          })
        : undefined,
  });
}

export const vgsLayer = new VectorLayer({
  source: new VectorSource({
    url: "/geojson/vgs.json",
    format: new GeoJSON(),
  }),
  style,
});
