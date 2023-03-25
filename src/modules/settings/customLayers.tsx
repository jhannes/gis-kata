export type CustomLayers = Record<
  string,
  {
    name: string;
    id: string;
  }
>;

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
