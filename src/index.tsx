import React from "react";
import ReactDOM from "react-dom/client";
import { Application } from "./modules/application";

const root = ReactDOM.createRoot(document.getElementById("root")!);

root.render(<Application />);
export { useFeatureCollection } from "./modules/geo/useFeatureCollection";
