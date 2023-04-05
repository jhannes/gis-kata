import * as React from "react";

export function Application() {
  return (
    <>
      <header>
        <h1>I'm a map application</h1>
      </header>
      <main>
        <nav>Navigation</nav>
        <div id="map">I'm a map</div>
        <aside>Details</aside>
      </main>
      <footer>Built with OpenLayers</footer>
    </>
  );
}
