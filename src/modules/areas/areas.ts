import { FeatureCollectionDto, MultiPolygonDto } from "../geo";

export interface MunicipalityPropertiesDto {
  navn: string;
  kommunenummer: string;
}

export type AreaFeatureCollectionDto = FeatureCollectionDto<
  MultiPolygonDto,
  MunicipalityPropertiesDto
>;
