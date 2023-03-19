import { FeatureDto, PointDto } from "../geo";

interface SchoolPropertiesDto {
  navn: string;
  antall_elever: number;
  antall_ansatte: number;
  laveste_trinn: number;
  hoyeste_trinn: number;
  eierforhold: "Privat" | "Offentlig";
  kommunenr: string;
}

export type SchoolFeatureDto = FeatureDto<PointDto, SchoolPropertiesDto>;