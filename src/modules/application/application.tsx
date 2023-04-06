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
        <h1>
          {hoverSkole?.getProperties()?.skolenavn || "Videregående skoler"}
        </h1>
      </header>
      <main>
        <nav>
          <div>Navigation</div>
        </nav>
        <MapView onHoverSkole={setHoverSkole} />
        <aside>Details</aside>
      </main>
      <footer>
        [ <a href={"https://github.com/jhannes/gis-kata"}>source code</a> ]
      </footer>
    </>
  );
}
