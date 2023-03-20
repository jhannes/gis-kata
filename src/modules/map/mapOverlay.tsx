import React, { MutableRefObject, useEffect, useMemo, useRef } from "react";
import { useMapContext } from "./mapContext";
import { Overlay } from "ol";

export function MapOverlay({
  children,
  position,
}: {
  position: Array<number> | undefined;
  children: React.ReactNode;
}) {
  const { map } = useMapContext();
  const overlay = useMemo(() => new Overlay({}), []);
  const overlayRef = useRef() as MutableRefObject<HTMLDivElement>;
  useEffect(() => overlay.setPosition(position), [position]);
  useEffect(() => {
    overlay.setElement(overlayRef.current);
    map.addOverlay(overlay);
    return () => {
      map.removeOverlay(overlay);
    };
  }, [overlay, overlayRef]);

  return (
    <div id="overlay" ref={overlayRef}>
      {children}
    </div>
  );
}
