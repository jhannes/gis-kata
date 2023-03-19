import React, { useEffect, useMemo, useState } from "react";
import VectorSource from "ol/source/Vector";
import VectorLayer from "ol/layer/Vector";
import { useMapLayer } from "../map/mapHooks";
import { PageHeader } from "../pageHeader";
import { sortBy } from "../localization/sortBy";
import { FeatureCollectionDto, GeometryDto, MultiPolygonDto } from "../geo/geo";
import { Link } from "react-router-dom";
import { Feature } from "ol";
import { MultiPolygon } from "ol/geom";

interface MunicipalityPropertiesDto {
  navn: string;
  kommunenummer: string;
}

function useFeatureCollection<
  GEO extends GeometryDto = GeometryDto,
  PROP = unknown
>() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(undefined);
  const [data, setData] = useState<FeatureCollectionDto<GEO, PROP>>();

  useEffect(() => {
    setData(undefined);
    setLoading(true);
    fetch("/gis-kata/geojson/areas.json")
      .then((res) => res.json())
      .then((res) => {
        setData(res);
        setLoading(false);
      })
      .catch((error) => setError(error));
  }, []);

  return { loading, error, data };
}

export function AreasSidebar() {
  const areaFeatureCollection = useFeatureCollection<
    MultiPolygonDto,
    MunicipalityPropertiesDto
  >();
  const areaLayer = useMemo(() => {
    return areaFeatureCollection.data
      ? new VectorLayer({
          source: new VectorSource({
            features: areaFeatureCollection.data.features.map(
              (f) => new Feature(new MultiPolygon(f.geometry.coordinates))
            ),
          }),
        })
      : new VectorLayer();
  }, [areaFeatureCollection.data]);

  useMapLayer(areaLayer);

  return (
    <>
      <PageHeader>
        <h1>Areas</h1>
      </PageHeader>
      <h2>Areas</h2>
      {areaFeatureCollection.loading && <div>Loading</div>}
      {areaFeatureCollection.data && (
        <div>
          {areaFeatureCollection.data.features
            .map((f) => f.properties)
            .sort(sortBy((f) => f.navn))
            .map((f) => (
              <div key={f.kommunenummer}>
                <Link to={`${f.kommunenummer}`}>{f.navn}</Link>
              </div>
            ))}
        </div>
      )}
    </>
  );
}
