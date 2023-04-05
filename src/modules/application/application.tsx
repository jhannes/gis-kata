import * as React from "react";
import { MapView } from "../map";

export function Application() {
  return (
    <>
      <header>
        <h1>I'm a map application</h1>
      </header>
      <main>
        <nav>Navigation</nav>
        <MapView />
        <aside>Details</aside>
      </main>
      <footer>Built with OpenLayers</footer>
    </>
  );
}
