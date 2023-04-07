import React from "react";

export function Application() {
  return (
    <>
      <header>
        <h1>Hello React Application</h1>
      </header>
      <main>
        <nav>
          <ul>
            <li>Navigation</li>
            <li>Settings</li>
          </ul>
        </nav>
        <div id="map" />
        <aside>Details</aside>
      </main>
      <footer>Geographic Web App demo</footer>
    </>
  );
}
