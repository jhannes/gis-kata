import { register } from "ol/proj/proj4";
import proj4 from "proj4";
import { WMTSCapabilities } from "ol/format";
import TileSource from "ol/source/Tile";
import { OSM, WMTS } from "ol/source";
import { optionsFromCapabilities } from "ol/source/WMTS";

export interface WTMSLayerDefinition {
  name: string;
  url: string;
  layer: string;
  matrixSet: string;
}

export type MapLayerDefinition =
  | { name: "Open Street Map" }
  | WTMSLayerDefinition;
export const openStreetMap: MapLayerDefinition = {
  name: "Open Street Map",
};

export const statkartBackground: MapLayerDefinition = {
  name: "Kartverket grunnkart",
  url: "https://opencache.statkart.no/gatekeeper/gk/gk.open_wmts?request=GetCapabilities&service=WMS",
  layer: "norgeskart_bakgrunn",
  matrixSet: "EPSG:25835",
};
export const polar: MapLayerDefinition = {
  name: "Geodata polar",
  url: "https://geodata.npolar.no/arcgis/rest/services/Basisdata_Intern/NP_Arktis_WMTS_3995/MapServer/WMTS/1.0.0/WMTSCapabilities.xml",
  layer: "Basisdata_Intern_NP_Arktis_WMTS_3995",
  matrixSet: "default028mm",
};

proj4.defs([
  [
    "urn:ogc:def:crs:EPSG::25832",
    "+proj=utm +zone=32 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
  ],
  [
    "urn:ogc:def:crs:EPSG::25835",
    "+proj=utm +zone=35 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
  ],
  [
    "urn:ogc:def:crs:EPSG::3995",
    "+proj=stere +lat_0=90 +lat_ts=71 +lon_0=0 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs +type=crs",
  ],
  [
    "EPSG:3573",
    "+proj=laea +lat_0=90 +lon_0=-100 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs +type=crs",
  ],
]);
register(proj4);

const parser = new WMTSCapabilities();
export type LoadedLayer = { source: TileSource } | { error: string };

export async function loadLayer(
  layerDefinition: MapLayerDefinition
): Promise<LoadedLayer> {
  if (!("url" in layerDefinition)) {
    return { source: new OSM() };
  }

  const { url, layer, matrixSet } = layerDefinition;
  try {
    const response = await fetch(url);
    const result = parser.read(await response.text());
    return {
      source: new WMTS(optionsFromCapabilities(result, { layer, matrixSet })!),
    };
  } catch (error) {
    return { error: "" + error };
  }
}
