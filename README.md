A demonstration of OpenLayers features
======================================

* A simple React application with parcel and typescript
* Layout of header, content and sidebars
* Display Open Street Map layer
* Include static content with map objects
* Display Vector Layer
* Style Vector Layer
* Hover over a feature in a Vector Layer
* Click on a feature in a Vector Layer
* Display an overlay on the map


## Notes:

1. `npm init -y`
2. `npm install --save-dev parcel typescript prettier parcel-reporter-static-files-copy @types/react @types/react-dom`
3. `npm install --save react react-dom ol`
4. Display map
   * `useGeographic()`
   * `const mapRef = useRef() as MutableRefObject<HTMLDivElement>;`
   * `const layers = useMemo(() => [new TileLayer({ source: new OSM() })], [])`
   * `const view = useMemo(() => new View({ center: [10.74, 59.92], zoom: 14 }), [])`
   * `const map = useMemo(() => new Map({layers, view}), [])`
   * `useEffect(() => map.setTarget(mapRef.current), [map, mapRef]);`
   * (NB: must also add a useEffect destructor)
5. Include static content
   * In `.parcelrc`: `{ "extends": ["@parcel/config-default"], "reporters":  ["...", "parcel-reporter-static-files-copy"] }`
   * Place files under `static`, e.g. `static/geojson/xxx.json`
6. Display vector layer
   * `const vectorLayer = useMemo(() => new VectorLayer({ source: new VectorSource({url: "/geojson/xxx.json", format: new GeoJSON()) }), [])`
   * Update layers: ``const layers = useMemo(() => [new TileLayer({ source: new OSM(), vectorLayer })], [vectorLayer])``
7. Style vector layer:
   * Update vectorLayer: `const vectorLayer = useMemo(() => new VectorLayer({ style: vectorLayerStyle, source: new VectorSource({url, format: new GeoJSON()) }), [])`
8. Hover over vector feature:
   * `useEffect(() => { map.on("pointermove", handleMapPointer); }, [map]);` (NB: Must also have a useEffect destructor)
   * `function handleMapPointer(event: MapBrowserEvent<MouseEvent>) {
     const features = map.getFeaturesAtPixel(event.pixel, { hitTolerance: 3 });
     setHoverFeature(features.length > 0 ? features[0] as Feature<MultiPoint> : undefined);
   }`
9. Display overlay:
   * `const overlayRef = useRef() as MutableRefObject<HTMLDivElement>;`
   * `const overlay = useMemo(() => new Overlay({}), []);`
   * `useEffect(() => { overlay.setElement(overlayRef.current); map.addOverlay(overlay); }, [overlay, overlayRef]);`
   * `useEffect(() => overlay.setPosition(overlayPosition), [overlayPosition])`
   * `const overlayPosition = useMemo(() => selectedFeatures[0]?.getGeometry()?.getCoordinates()[0], [selectedFeatures]);`
