import * as React from "react";
import { DefaultApi } from "../../generated";
import { Route, Routes } from "react-router-dom";
import { ShowSchool } from "./showSchool";
import { ListSchools } from "./listSchools";
import { useLoading } from "../hooks/useLoading";
import { LoadingScreen } from "../loader/loadingScreen";

export function SchoolsRoute() {
  const defaultApi = new DefaultApi();
  const { loading, data: schools } = useLoading(
    async () => await defaultApi.listSchoolFeatures()
  );

  if (loading || !schools) {
    return <LoadingScreen />;
  }

  return (
    <Routes>
      <Route path={"/:id"} element={<ShowSchool schools={schools} />} />
      <Route path={"/"} element={<ListSchools schools={schools} />} />
    </Routes>
  );
}
