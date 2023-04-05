import * as React from "react";
import { useState } from "react";
import { MapView } from "../map";
import { Feature } from "ol";
import { MultiPoint } from "ol/geom";

export function Application() {
  const [hoverSkole, setHoverSkole] = useState<Feature<MultiPoint>>();
  return (
    <>
      <header>
        <h1>Selecting school {hoverSkole?.getProperties()?.skolenavn}</h1>
      </header>
      <main>
        <nav>Navigation</nav>
        <MapView onHoverSkole={setHoverSkole} />
        <aside>Details</aside>
      </main>
      <footer>Built with OpenLayers</footer>
    </>
  );
}
