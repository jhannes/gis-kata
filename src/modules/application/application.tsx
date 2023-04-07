import * as React from "react";
import { useState } from "react";
import { Navigation } from "./navigation";
import { MapView } from "../map";
import { Feature } from "ol";
import { MultiPoint } from "ol/geom";

export function Application() {
  const [featureUnderPointer, setFeatureUnderPointer] = useState<
    Feature<MultiPoint> | undefined
  >();

  return (
    <>
      <header>
        <h1>
          {featureUnderPointer
            ? featureUnderPointer.getProperties()?.skolenavn
            : "Videregående skoler"}
        </h1>
      </header>
      <main>
        <Navigation />
        <MapView onFeatureUnderPointer={setFeatureUnderPointer} />
        <aside>Details</aside>
      </main>
      <footer>Geographic Web App demo</footer>
    </>
  );
}
