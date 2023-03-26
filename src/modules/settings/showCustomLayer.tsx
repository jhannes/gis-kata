import { Link, Route, Routes, useParams } from "react-router-dom";
import { CustomLayer, getCustomLayers } from "./customLayers";
import React, { useMemo } from "react";
import { DrawNewObject } from "./drawNewObject";
import { createFeature, useMapLayer } from "../map";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { customLayerStyle } from "./customLayerStyle";

function CustomLayerOverview({
  customLayer: { features, name },
}: {
  customLayer: CustomLayer;
}) {
  const layer = useMemo(() => {
    return new VectorLayer({
      style: customLayerStyle,
      source: new VectorSource({
        features: Object.keys(features || {}).map((name) =>
          createFeature({ ...features[name], properties: { name } })
        ),
      }),
    });
  }, []);
  useMapLayer(layer);

  return (
    <>
      <h2>Custom layer {name}</h2>
      <h3>Existing objects</h3>

      {Object.keys(features || {}).map((f) => (
        <div key={f}>{f}</div>
      ))}

      <h3>Add object</h3>
      <div>
        <Link to={"./draw?type=Point"}>
          <button>Point</button>
        </Link>
      </div>
      <div>
        <Link to={"./draw?type=Polygon"}>
          <button>Polygon</button>
        </Link>
      </div>
      <div>
        <Link to={"./draw?type=LineString"}>
          <button>Linestring</button>
        </Link>
      </div>
      <div>
        <Link to={"./draw?type=Circle"}>
          <button>Circle</button>
        </Link>
      </div>
    </>
  );
}

export function ShowCustomLayer() {
  const { id } = useParams();
  const customLayer = id ? getCustomLayers()[id] : undefined;
  if (!customLayer) {
    return <h2>Not found</h2>;
  }

  return (
    <Routes>
      <Route
        path={"draw"}
        element={<DrawNewObject customLayer={customLayer} />}
      />
      <Route
        path={"/"}
        element={<CustomLayerOverview customLayer={customLayer} />}
      />
    </Routes>
  );
}
