import proj4 from "proj4";
import { register } from "ol/proj/proj4";

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

export const layersDefinitions = [
  {
    name: "Open Street Map",
  },
  {
    name: "ArcticConnect",
    url: "https://tiles.arcticconnect.ca/mapproxy/service?REQUEST=GetCapabilities&SERVICE=WMTS",
    layer: "awm2",
    matrixSet: "laea3573",
  },
  {
    name: "Kartverket grunnkart",
    url: "https://opencache.statkart.no/gatekeeper/gk/gk.open_wmts?request=GetCapabilities&service=WMS",
    layer: "norgeskart_bakgrunn",
    matrixSet: "EPSG:25835",
  },
  {
    name: "Kartverket topografisk",
    url: "https://opencache.statkart.no/gatekeeper/gk/gk.open_wmts?request=GetCapabilities&service=WMS",
    layer: "topo4",
    matrixSet: "EPSG:25835",
  },
  {
    name: "Statkart",
    url: "http://opencache.statkart.no/gatekeeper/gk/gk.open_nib_utm32_wmts_v2?SERVICE=WMTS&REQUEST=GetCapabilities",
    layer: "Nibcache_UTM32_EUREF89_v2",
    matrixSet: "default028mm",
  },
  {
    name: "Geodata polar",
    url: "https://geodata.npolar.no/arcgis/rest/services/Basisdata_Intern/NP_Arktis_WMTS_3995/MapServer/WMTS/1.0.0/WMTSCapabilities.xml",
    layer: "Basisdata_Intern_NP_Arktis_WMTS_3995",
    matrixSet: "default028mm",
  },
  {
    name: "broken on purpose",
    url: "http://basemap.arctic-sdi.org/mapcache/wmts/?service=wmts&version=1.1.0&request=getcapabilities",
    layer: "arctic_cascading",
    matrixSet: "3571",
  },
];
