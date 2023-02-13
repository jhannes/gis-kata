import * as React from "react";
import { useContext, useEffect, useState } from "react";
import { OSM, WMTS } from "ol/source";

import "ol/ol.css";
import { ModalWindow } from "./modalWindow";
import TileSource from "ol/source/Tile";
import { WMTSCapabilities } from "ol/format";
import { optionsFromCapabilities } from "ol/source/WMTS";
import { MapContext } from "./mapContext";
import TileLayer from "ol/layer/Tile";

type LayerDefinition =
  | {
      name: string;
    }
  | { name: string; url: string; layer: string; matrixSet: string };

type LoadedLayer = { source: TileSource } | { error: string };

const parser = new WMTSCapabilities();

async function loadLayer({
  url,
  layer,
  matrixSet,
}: {
  url: string;
  layer: string;
  matrixSet: string;
}): Promise<LoadedLayer> {
  try {
    const response = await fetch(url);
    const result = parser.read(await response.text());
    const options = optionsFromCapabilities(result, {
      layer,
      matrixSet,
    })!;
    return { source: new WMTS(options) };
  } catch (error) {
    return { error: "" + error };
  }
}

function LayerRadioButton({
  name,
  layer,
}: {
  name: string;
  layer?: LoadedLayer;
}) {
  const { setBaseLayer } = useContext(MapContext);
  if (!layer) {
    return (
      <label>
        <input type="radio" name="baseLayer" disabled={true} />
        {` ${name} (Loading)`}
      </label>
    );
  }
  if ("error" in layer) {
    return (
      <label>
        <input type="radio" name="baseLayer" disabled={true} />
        {` ${name} (${layer.error})`}
      </label>
    );
  }

  return (
    <label>
      <input
        type="radio"
        name="baseLayer"
        onChange={() => {
          setBaseLayer(new TileLayer({ source: layer.source }));
        }}
      />{" "}
      {name}
    </label>
  );
}

function BaseLayerRadioList({
  layerDefinitions,
  layers,
  onClose,
}: {
  layerDefinitions: LayerDefinition[];
  layers: Record<string, LoadedLayer>;
  onClose: () => void;
}) {
  return (
    <ModalWindow onClose={onClose}>
      {layerDefinitions.map((l) => (
        <div key={l.name}>
          <LayerRadioButton name={l.name} layer={layers[l.name]} />
        </div>
      ))}
    </ModalWindow>
  );
}

export function BaseLayerSelector({
  layerDefinitions,
}: {
  layerDefinitions: LayerDefinition[];
}) {
  const [layers, setLayers] = useState<Record<string, LoadedLayer>>({
    "Open Street Map": { source: new OSM() },
  });
  useEffect(() => {
    for (const def of layerDefinitions) {
      if ("url" in def) {
        loadLayer(def).then((res) =>
          setLayers((old) => ({ ...old, [def.name]: res }))
        );
      }
    }
  }, []);
  const [open, setOpen] = useState(false);

  function handleOpen() {
    setOpen((s) => !s);
  }

  return (
    <div className="ol-control map-layerselector">
      <button onClick={handleOpen} type="button">
        🗺️
      </button>
      {open && (
        <BaseLayerRadioList
          layerDefinitions={layerDefinitions}
          layers={layers}
          onClose={() => setOpen(false)}
        />
      )}
    </div>
  );
}
