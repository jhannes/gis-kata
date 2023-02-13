import * as React from "react";
import { Dispatch, ReactNode, SetStateAction } from "react";
import { Layer } from "ol/layer";

export const MapContext = React.createContext<{
  setBaseLayer: Dispatch<SetStateAction<Layer>>;
  setFeatureLayers: Dispatch<SetStateAction<Layer[]>>;
  setOverlayPosition: Dispatch<SetStateAction<number[] | undefined>>;
  overlayContent?: ReactNode | undefined;
  setOverlayContent: Dispatch<SetStateAction<ReactNode | undefined>>;
}>({
  setBaseLayer: () => {},
  setFeatureLayers: () => {},
  setOverlayPosition: () => {},
  setOverlayContent: () => {},
});