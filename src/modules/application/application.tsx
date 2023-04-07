import React from "react";

export function Application() {
  return (
    <>
      <header>
        <h1>Hello React Application</h1>
      </header>
      <main>
        <nav>
          <h2>Menu</h2>
          <ul
            style={{ display: "flex", flexDirection: "column", height: "100%" }}
          >
            <li>Navigation</li>
            <div style={{ flex: 1 }} />
            <li>Settings</li>
          </ul>
        </nav>
        <div id="map">I'm a map</div>
        <aside>Details</aside>
      </main>
      <footer>Geographic Web App demo</footer>
    </>
  );
}
