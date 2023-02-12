import * as React from "react";
import { useEffect, useState } from "react";
import { DefaultApi, SchoolFeatureCollectionDto } from "../../generated";
import { Route, Routes } from "react-router-dom";
import { ShowSchool } from "./showSchool";
import { ListSchools } from "./listSchools";

export function SchoolsRoute() {
  const [loading, setLoading] = useState(true);
  const [schools, setSchools] = useState<SchoolFeatureCollectionDto>();
  useEffect(() => {
    (async () => {
      const defaultApi = new DefaultApi();
      setLoading(true);
      setSchools(await defaultApi.listSchoolFeatures());
      setLoading(false);
    })();
  }, []);

  if (loading || !schools) {
    return <div>"Loading ..."</div>;
  }

  return (
    <Routes>
      <Route path={"/:id"} element={<ShowSchool schools={schools} />} />
      <Route path={"/"} element={<ListSchools schools={schools} />} />
    </Routes>
  );
}
