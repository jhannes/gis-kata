import React, { ReactNode, useEffect } from "react";
import { useMapContext } from "./mapContext";

export function MapOverlay({
  children,
  position,
}: {
  position: Array<number> | undefined;
  children: ReactNode;
}) {
  const { setOverlay } = useMapContext();
  useEffect(() => {
    setOverlay({ position, children });
    return () => setOverlay({ position: undefined });
  }, [position]);
  return null;
}
