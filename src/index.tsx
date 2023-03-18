import React from "react";
import ReactDOM from "react-dom/client";
import { Application } from "./modules/application";

const root = ReactDOM.createRoot(document.getElementById("root")!);

root.render(<Application />);
export { PageHeader } from "./modules/pageHeader/pageHeader";
export { MapView } from "./modules/map/mapView";
