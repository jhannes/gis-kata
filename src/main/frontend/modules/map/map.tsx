import * as React from "react";
import { ReactNode } from "react";

const MapContext = React.createContext<{}>({});

export function MapContextProvider({ children }: { children: ReactNode }) {
  return <MapContext.Provider value={{}}>{children}</MapContext.Provider>;
}

export function MapView() {
  return <div id="map">I'm a map</div>;
}
