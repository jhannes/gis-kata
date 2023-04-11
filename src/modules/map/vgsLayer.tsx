import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { GeoJSON } from "ol/format";
import { Fill, Stroke, Style, Text } from "ol/style";
import CircleStyle from "ol/style/Circle";
import { FeatureLike } from "ol/Feature";

function vgsStyle(f: FeatureLike, resolution: number) {
  const school = f.getProperties();
  return new Style({
    image: new CircleStyle({
      radius: 8,
      stroke: new Stroke({ color: "black", width: 2 }),
      fill:
        school.eierforh == "Offentlig"
          ? new Fill({ color: "blue" })
          : new Fill({ color: "purple" }),
    }),
    text:
      resolution < 10
        ? new Text({
            text: school.skolenavn?.substring(0, 20),
            font: "14pt bold sans",
            offsetY: -15,
            stroke: new Stroke({ color: "white", width: 3 }),
          })
        : undefined,
  });
}

export const vgsLayer = new VectorLayer({
  source: new VectorSource({
    url: "/geojson/vgs.json",
    format: new GeoJSON(),
  }),
  style: vgsStyle,
});
