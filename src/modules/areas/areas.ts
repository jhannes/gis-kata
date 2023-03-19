import { FeatureCollectionDto, FeatureDto, MultiPolygonDto } from "../geo";

export interface MunicipalityPropertiesDto {
  navn: string;
  kommunenummer: number;
}

export type AreaFeatureDto = FeatureDto<
  MultiPolygonDto,
  MunicipalityPropertiesDto
>;

export type AreaFeatureCollectionDto = FeatureCollectionDto<AreaFeatureDto>;
