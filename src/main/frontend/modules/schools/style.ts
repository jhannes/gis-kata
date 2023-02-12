import { ColorLike } from "ol/colorlike";
import { Color } from "ol/color";
import { Circle, Fill, Stroke, Style, Text } from "ol/style";

export function schoolCircleStyle(color: ColorLike | Color) {
  return new Style({
    image: new Circle({
      radius: 4,
      stroke: new Stroke({ color: [0, 0, 0] }),
      fill: new Fill({ color }),
    }),
  });
}

export function textStyle(text: string | string[] | undefined) {
  return new Style({
    text: new Text({
      offsetY: 10,
      text,
      font: "Bold 14px Arial",
    }),
  });
}
