import { useMapContext, useMapLayer } from "../map";
import React, { useEffect, useMemo, useState } from "react";
import VectorSource from "ol/source/Vector";
import VectorLayer from "ol/layer/Vector";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Type } from "ol/geom/Geometry";
import { Draw } from "ol/interaction";
import { GeoJSON } from "ol/format";
import { updateCustomLayers } from "./customLayers";
import { Circle, Geometry } from "ol/geom";
import { fromCircle } from "ol/geom/Polygon";
import { Feature } from "ol";

const geoJSON = new GeoJSON();

export function DrawNewObject({
  customLayer,
}: {
  customLayer: { name: string; id: string };
}) {
  const [name, setName] = useState("");
  const { map } = useMapContext();
  const navigate = useNavigate();
  const drawSource = useMemo(() => new VectorSource(), []);
  const [geometry, setGeometry] = useState<Geometry>();
  const layer = useMemo(() => {
    return new VectorLayer({
      source: new VectorSource({
        features: geometry ? [new Feature(geometry)] : [],
      }),
    });
  }, [geometry]);
  const [searchParams] = useSearchParams();
  const type = searchParams.get("type") as Type;
  useMapLayer(layer);
  useEffect(() => {
    if (!geometry) {
      drawSource.clear();
      const draw = new Draw({
        source: drawSource,
        type: type,
      });
      draw.on("drawend", (e) => {
        map.removeInteraction(draw);

        const geometry = e.feature.getGeometry();
        if (geometry?.getType() === "Circle") {
          const circle = geometry as Circle;
          circle.transform("EPSG:4326", map.getView().getProjection());
          const polygon = fromCircle(circle);
          polygon.transform(map.getView().getProjection(), "EPSG:4326");
          setGeometry(polygon);
        } else {
          setGeometry(geometry);
        }
      });
      map.addInteraction(draw);
      return () => {
        map.removeInteraction(draw);
      };
    }
  }, [geometry]);

  function handleSubmit() {
    updateCustomLayers((layers) => {
      const featureDto = geoJSON.writeFeatureObject(
        new Feature({
          geometry,
          name,
        })
      );
      if (!layers[customLayer.id].features) {
        layers[customLayer.id].features = {
          [name]: featureDto,
        };
      } else {
        layers[customLayer.id].features[name] = featureDto;
      }
    });
    navigate("..");
  }

  return (
    <>
      <h2>Draw new {type}</h2>
      <div>
        <label>
          Name:{" "}
          <input
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </label>
      </div>
      <button onClick={handleSubmit} disabled={!geometry || !name}>
        Save
      </button>
      <button disabled={!geometry} onClick={() => setGeometry(undefined)}>
        Draw again
      </button>
      <Link to={".."}>
        <button>Cancel</button>
      </Link>
    </>
  );
}
