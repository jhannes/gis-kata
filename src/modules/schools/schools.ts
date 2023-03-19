import {
  FeatureCollectionDto,
  FeatureDto,
  Loading,
  PointDto,
  useFeatureCollection,
} from "../geo";

export interface SchoolPropertiesDto {
  navn: string;
  antall_elever: number;
  antall_ansatte: number;
  laveste_trinn: number;
  hoyeste_trinn: number;
  eierforhold: "Privat" | "Offentlig";
  kommunenummer: string;
}

export type SchoolFeatureDto = FeatureDto<PointDto, SchoolPropertiesDto>;

export type SchoolFeatureCollectionDto = FeatureCollectionDto<
  PointDto,
  SchoolPropertiesDto
>;

export function slugify(s: SchoolPropertiesDto) {
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

export function useSchools(): Loading<SchoolFeatureCollectionDto> {
  return useFeatureCollection("/gis-kata/geojson/schools.json");
}
