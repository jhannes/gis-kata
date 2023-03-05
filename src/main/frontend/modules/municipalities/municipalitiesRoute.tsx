import React from "react";
import { DefaultApi } from "../../generated";
import { useLoading } from "../hooks/useLoading";
import { LoadingScreen } from "../loader/loadingScreen";
import { Route, Routes } from "react-router-dom";
import { ListMunicipalities } from "./listMunicipalities";

export function MunicipalitiesRoute() {
  const defaultApi = new DefaultApi();
  const { loading, data: municipalities } = useLoading(
    async () => await defaultApi.listMunicipalityFeatures()
  );

  if (loading || !municipalities) {
    return <LoadingScreen />;
  }

  return (
    <Routes>
      <Route
        path={"/"}
        element={<ListMunicipalities municipalities={municipalities} />}
      />
    </Routes>
  );
}
