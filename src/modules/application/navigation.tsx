import React from "react";

export function Navigation() {
  return (
    <nav>
      <h2>Menu</h2>
      <ul style={{ display: "flex", flexDirection: "column", height: "100%" }}>
        <li>Navigation</li>
        <div style={{ flex: 1 }} />
        <li>Settings</li>
      </ul>
    </nav>
  );
}