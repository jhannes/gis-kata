import { FeatureDto, GeometryDto } from "../geo";

export interface CustomLayer {
  features: Record<string, FeatureDto<GeometryDto, object>>;
  name: string;
  id: string;
}

export type CustomLayers = Record<string, CustomLayer>;

export function getCustomLayers() {
  return JSON.parse(
    localStorage.getItem("customLayers") || "{}"
  ) as CustomLayers;
}

export function updateCustomLayers(update: (layers: CustomLayers) => void) {
  const layers = getCustomLayers();
  update(layers);
  localStorage.setItem("customLayers", JSON.stringify(layers));
}
