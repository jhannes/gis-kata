import { FeatureCollectionDto, FeatureDto, MultiPolygonDto } from "../geo";

export interface MunicipalityPropertiesDto {
  navn: string;
  kommunenummer: string;
}

export type AreaFeatureDto = FeatureDto<
  MultiPolygonDto,
  MunicipalityPropertiesDto
>;

export type AreaFeatureCollectionDto = FeatureCollectionDto<AreaFeatureDto>;
