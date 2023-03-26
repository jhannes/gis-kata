import React from "react";
import { Route, Routes } from "react-router-dom";
import { ShowAllSettings } from "./showAllSettings";
import { ShowCustomLayer } from "./showCustomLayer";
import { NewCustomLayer } from "./newCustomLayer";

export function SettingsRoutes() {
  return (
    <Routes>
      <Route path={"/"} element={<ShowAllSettings />} />
      <Route path={"/new"} element={<NewCustomLayer />} />
      <Route path={"/:id/*"} element={<ShowCustomLayer />} />
      <Route path={"*"} element={<h2>Invalid path</h2>} />
    </Routes>
  );
}
