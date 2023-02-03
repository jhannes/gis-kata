import * as React from "react";
import {
  BrowserRouter,
  Link,
  Route,
  Routes,
  useParams,
} from "react-router-dom";

export function Application() {
  return (
    <BrowserRouter>
      <header>
        <h1>Hello Application</h1>
      </header>
      <main>
        <aside id="menu-sidebar">
          <nav>
            <li>Home</li>
            <li>Items</li>
            <div className="spacer"></div>
            <li>Help</li>
          </nav>
        </aside>
        <main id="map"></main>
        <ContentSidebar />
      </main>
      <footer>
        Application by Johannes [<a href="/api-doc/">API doc</a>]
      </footer>
    </BrowserRouter>
  );
}

function ContentSidebar() {
  return (
    <aside id="content-sidebar">
      <Routes>
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
