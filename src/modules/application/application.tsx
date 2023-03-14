import React from "react";

export function Application() {
  return (
    <>
      <header>
        <h1>Hello Application</h1>
      </header>
      <main>
        <aside id="menu-sidebar">
          <nav>
            <li>Home</li>
            <li>Areas</li>
            <div className="spacer"></div>
            <li>Help</li>
          </nav>
        </aside>
        <div id="map">I'm a map</div>
        <aside id="content-sidebar">
          <h1>Items</h1>
          <ul>
            <li>Item</li>
            <li>Item</li>
          </ul>
        </aside>
      </main>
      <footer>Application by Johannes</footer>
    </>
  );
}
