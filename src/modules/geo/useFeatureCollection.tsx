import { FeatureCollectionDto, FeatureDto } from "./geo";
import { useEffect, useState } from "react";

export function useFeatureCollection<FEATURE extends FeatureDto>(url: any) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(undefined);
  const [data, setData] = useState<FeatureCollectionDto<FEATURE>>();

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
