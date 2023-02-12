import { SchoolFeaturePropertiesDto } from "../../generated";

export function slugify(s: SchoolFeaturePropertiesDto) {
  return (
    s.kommunenummer +
    "-" +
    s.navn
      .toLowerCase()
      .replace("æ", "a")
      .replace("ø", "o")
      .replace("å", "a")
      .replace(/ /g, "-")
      .replace(/[^a-z0-9_-]/g, "")
  );
}
