import React from "react";
import { HashRouter, Link, Route, Routes, useParams } from "react-router-dom";
import { PageHeader, PageHeaderContext, ShowPageHeader } from "../pageHeader";
import {
  MapBaseLayerSelector,
  MapContextProvider,
  MapView,
  openStreetMap,
  polar,
  statkartBackground,
} from "../map";
import { AreasRoutes } from "../areas";
import { SchoolRoutes, useSchools } from "../schools";
import { SettingsRoutes } from "../settings";

export function Application() {
  return (
    <HashRouter>
      <PageHeaderContext>
        <MapContextProvider>
          <ShowPageHeader>
            <h1>Map demo application</h1>
          </ShowPageHeader>
          <main>
            <aside id="menu-sidebar">
              <nav>
                <li>Home</li>
                <li>
                  <Link to={"/areas"}>Areas</Link>
                </li>
                <li>
                  <Link to={"/schools"}>Schools</Link>
                </li>
                <div className="spacer"></div>
                <li>
                  ⚙ <Link to={"/settings"}>Settings</Link>
                </li>
              </nav>
            </aside>
            <MapView>
              <MapBaseLayerSelector
                baseLayers={[openStreetMap, statkartBackground, polar]}
              />
            </MapView>
            <ContentSidebar />
          </main>
          <footer>
            [<a href="https://github.com/jhannes/gis-kata"> source code </a>]
          </footer>
        </MapContextProvider>
      </PageHeaderContext>
    </HashRouter>
  );
}

function ContentSidebar() {
  const schools = useSchools();

  if (!schools.data) {
    return <div>Loading...</div>;
  }

  return (
    <aside id="content-sidebar">
      <Routes>
        <Route
          path={"/areas/*"}
          element={<AreasRoutes schools={schools.data} />}
        />
        <Route
          path={"/schools/*"}
          element={<SchoolRoutes schools={schools.data} />}
        />
        <Route path={"/item/:id"} element={<Item />} />
        <Route path={"/settings/*"} element={<SettingsRoutes />} />
        <Route path={"/"} element={<ListItems />} />
        <Route path={"*"} element={<h2>Not found</h2>} />
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
  const items = [...Array(20).keys()].map((i) => ({
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
