import * as React from "react";
import { MutableRefObject, PropsWithChildren, useEffect, useRef } from "react";

export function ModalWindow({
  children,
  onClose,
}: PropsWithChildren<{ onClose(): void }>) {
  const ref = useRef() as MutableRefObject<HTMLDivElement>;

  function handleMouseClick(e: MouseEvent) {
    if (e.target && !ref.current.contains(e.target as HTMLDivElement)) {
      onClose();
    }
  }

  useEffect(() => {
    window.addEventListener("mousedown", handleMouseClick);
    return () => window.removeEventListener("mousedown", handleMouseClick);
  }, []);

  return <div ref={ref}>{children}</div>;
}
