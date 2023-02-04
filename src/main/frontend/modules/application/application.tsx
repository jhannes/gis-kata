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
import { ListSchools } from "../schools/schools";

export function Application() {
  return (
    <PageHeaderContext>
      <MapContextProvider>
        <BrowserRouter>
          <ShowPageHeader>
            <h1>Hello My Application</h1>
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
  return (
    <aside id="content-sidebar">
      <Routes>
        <Route path={"/item/:id"} element={<Item />} />
        <Route path={"/"} element={<ListItems />} />
        <Route path={"/schools"} element={<ListSchools />} />
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
