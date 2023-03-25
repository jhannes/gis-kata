import { getCustomLayers } from "./customLayers";
import { Link } from "react-router-dom";
import React from "react";

export function ShowAllSettings() {
  const customLayers = getCustomLayers();
  return (
    <>
      <h2>Settings</h2>
      <h3>Custom layers</h3>
      <ul>
        <li>
          add➕ <Link to={"new"}>Create custom layer</Link>
        </li>
        {Object.keys(customLayers)
          .map((n) => customLayers[n])
          .map((layer) => (
            <li key={layer.id}>
              <Link to={layer.id}>{layer.name}</Link>
            </li>
          ))}
      </ul>
    </>
  );
}