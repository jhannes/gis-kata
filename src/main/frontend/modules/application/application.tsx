import * as React from "react";
import {
  BrowserRouter,
  Link,
  Route,
  Routes,
  useParams,
} from "react-router-dom";
import { PageHeader, PageHeaderContext, ShowPageHeader } from "../pageHeader";
import { MapContextProvider, MapView } from "../map";
import { SchoolsRoute } from "../schools";
import { MunicipalitiesRoute } from "../municipalities";
import { DefaultApi } from "../../../../../target/generated-sources/openapi-typescript";
import { useLoading } from "../hooks/useLoading";
import { LoadingScreen } from "../loader/loadingScreen";

export function Application() {
  return (
    <PageHeaderContext>
      <MapContextProvider>
        <BrowserRouter>
          <ShowPageHeader>
            <h1>Schools in Norway</h1>
          </ShowPageHeader>
          <main>
            <aside id="menu-sidebar">
              <nav>
                <li>
                  <Link to={"/"}>Home</Link>
                </li>
                <li>
                  <Link to={"/schools"}>Schools</Link>
                </li>
                <li>
                  <Link to={"/municipalities"}>Municipalities</Link>
                </li>
                <div className="spacer"></div>
                <li>
                  <Link to={"/settings"}>Settings</Link>
                </li>
              </nav>
            </aside>
            <MapView />
            <ContentSidebar />
          </main>
          <footer>
            Application by Johannes [<a href="/api-doc/">API doc</a>]
          </footer>
        </BrowserRouter>
      </MapContextProvider>
    </PageHeaderContext>
  );
}

function ContentSidebar() {
  const defaultApi = new DefaultApi();
  const { loading, data: schools } = useLoading(
    async () => await defaultApi.listSchoolFeatures()
  );

  if (loading || !schools) {
    return <LoadingScreen />;
  }

  return (
    <aside id="content-sidebar">
      <Routes>
        <Route path={"/item/:id"} element={<Item />} />
        <Route path={"/"} element={<ListItems />} />
        <Route
          path={"/schools/*"}
          element={<SchoolsRoute schools={schools} />}
        />
        <Route
          path={"/municipalities/*"}
          element={<MunicipalitiesRoute schools={schools} />}
        />
        <Route path={"/*"} element={<h1>Not found</h1>} />
      </Routes>
    </aside>
  );
}

function Item() {
  const { id } = useParams();

  return (
    <>
      <PageHeader>
        <h1>Item {id}</h1>
      </PageHeader>
      <Link to={"/"}>Back</Link>
      <h1>Element {id}</h1>
    </>
  );
}

function ListItems() {
  const items = [...Array(60).keys()].map((i) => ({
    id: i,
    name: `Item number ${i}`,
  }));
  return (
    <>
      <h1>Items</h1>
      <ul>
        {items.map(({ id, name }) => (
          <li key={id}>
            <Link to={`/item/${id}`}>{name}</Link>
          </li>
        ))}
      </ul>
    </>
  );
}
