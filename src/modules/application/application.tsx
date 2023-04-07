import React from "react";
import { Navigation } from "./navigation";
import { MapView } from "../map";

export function Application() {
  return (
    <>
      <header>
        <h1>Hello React Application</h1>
      </header>
      <main>
        <Navigation />
        <MapView />
        <aside>Details</aside>
      </main>
      <footer>Geographic Web App demo</footer>
    </>
  );
}
