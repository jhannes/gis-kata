import { useEffect, useState } from "react";

export function useLoading<T>(loader: () => Promise<T>) {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<T>();
  useEffect(() => {
    (async () => {
      setLoading(true);
      setData(await loader());
      setLoading(false);
    })();
  }, []);

  return { loading, data };
}