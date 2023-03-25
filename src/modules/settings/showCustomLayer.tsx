import { useParams } from "react-router-dom";
import { getCustomLayers } from "./customLayers";
import React from "react";

export function ShowCustomLayer() {
  const { id } = useParams();
  const customLayer = id ? getCustomLayers()[id] : undefined;
  if (!customLayer) {
    return <h2>Not found</h2>;
  }

  return <h2>Custom layer {customLayer.name}</h2>;
}