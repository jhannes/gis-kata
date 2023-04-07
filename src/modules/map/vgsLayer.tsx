import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { GeoJSON } from "ol/format";
import { Circle, Fill, Style } from "ol/style";
import { FeatureLike } from "ol/Feature";

const offentligFill = new Fill({ color: "blue" });
const privatFill = new Fill({ color: "purple" });

function style(feature: FeatureLike) {
  return new Style({
    image: new Circle({
      radius: 5,
      fill:
        feature.getProperties().eierforh === "Offentlig"
          ? offentligFill
          : privatFill,
    }),
  });
}

export const vgsLayer = new VectorLayer({
  source: new VectorSource({
    url: "/geojson/vgs.json",
    format: new GeoJSON(),
  }),
  style,
});
