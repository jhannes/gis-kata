import { FeatureCollectionDto, GeometryDto } from "./geo";
import { useEffect, useState } from "react";

export interface Loading<T> {
  loading: boolean;
  data: T | undefined;
  error: unknown;
}

export function useFeatureCollection<
  GEO extends GeometryDto,
  PROPS extends object
>(url: any): Loading<FeatureCollectionDto<GEO, PROPS>> {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(undefined);
  const [data, setData] = useState<FeatureCollectionDto<GEO, PROPS>>();

  useEffect(() => {
    setData(undefined);
    setLoading(true);
    fetch(url)
      .then((res) => res.json())
      .then((res) => {
        setData(res);
        setLoading(false);
      })
      .catch((error) => setError(error));
  }, []);

  return { loading, error, data };
}
