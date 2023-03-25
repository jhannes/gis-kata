import React from "react";
import { Route, Routes, useParams } from "react-router-dom";

function ShowAllSettings() {
  return <h2>Settings</h2>;
}

function ShowCustomLayer() {
  const { id } = useParams();
  return <h2>Settings {id}</h2>;
}

export function SettingsRoutes() {
  return (
    <Routes>
      <Route path={"/"} element={<ShowAllSettings />} />
      <Route path={"/:id"} element={<ShowCustomLayer />} />
      <Route path={"*"} element={<h2>Invalid path</h2>} />
    </Routes>
  );
}
