import React, { useState } from "react";
import { MapView } from "../map";
import { Feature } from "ol";
import { MultiPoint } from "ol/geom";

export function Application() {
  const [schoolsUnderMouse, setSchoolsUnderMouse] = useState<
    Feature<MultiPoint>[]
  >([]);
  return (
    <>
      <header>
        <h1>
          {schoolsUnderMouse.length > 0
            ? schoolsUnderMouse[0].getProperties().skolenavn
            : "Videregående skoler"}
        </h1>
      </header>
      <main>
        <nav>
          <h2>Navigation</h2>
        </nav>
        <MapView onHoverOverSchools={setSchoolsUnderMouse} />
        <aside>Details</aside>
      </main>
      <footer>Made by Johannes with OpenLayers</footer>
    </>
  );
}
