import React from "react";
import { HashRouter, Link, Route, Routes, useParams } from "react-router-dom";
import { PageHeader, PageHeaderContext, ShowPageHeader } from "../pageHeader";
import { MapContextProvider, MapView } from "../map";
import { AreasSidebar } from "../areas";

export function Application() {
  return (
    <PageHeaderContext>
      <MapContextProvider>
        <HashRouter>
          <ShowPageHeader>
            <h1>Hello Application</h1>
          </ShowPageHeader>
          <main>
            <aside id="menu-sidebar">
              <nav>
                <li>Home</li>
                <li>
                  <Link to={"/areas"}>Areas</Link>
                </li>
                <div className="spacer"></div>
                <li>Help</li>
              </nav>
            </aside>
            <MapView />
            <ContentSidebar />
          </main>
          <footer>Application by Johannes</footer>
        </HashRouter>
      </MapContextProvider>
    </PageHeaderContext>
  );
}

function ContentSidebar() {
  return (
    <aside id="content-sidebar">
      <Routes>
        <Route path={"/areas/*"} element={<AreasSidebar />} />
        <Route path={"/item/:id"} element={<Item />} />
        <Route path={"/"} element={<ListItems />} />
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
