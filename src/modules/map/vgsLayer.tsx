import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { GeoJSON } from "ol/format";

export const vgsLayer = new VectorLayer({
  source: new VectorSource({
    url: "/geojson/vgs.json",
    format: new GeoJSON(),
  }),
});
