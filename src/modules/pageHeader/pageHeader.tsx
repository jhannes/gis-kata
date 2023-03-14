import * as React from "react";
import { ReactElement, useContext, useEffect, useState } from "react";

const HeaderContext = React.createContext<{
  pageHeader?: ReactElement;
  setPageHeader(pageHeader?: ReactElement): void;
}>({
  setPageHeader: () => {},
});

function usePageHeader(element: ReactElement) {
  const { setPageHeader } = useContext(HeaderContext);
  useEffect(() => {
    setPageHeader(element);
    return () => setPageHeader(undefined);
  }, []);
}

export function PageHeader({ children }: { children: ReactElement }) {
  usePageHeader(children);
  return null;
}

export function ShowPageHeader({ children }: { children: ReactElement }) {
  const { pageHeader } = useContext(HeaderContext);
  return <header>{pageHeader || children}</header>;
}

export function PageHeaderContext({ children }: { children: ReactElement }) {
  const [pageHeader, setPageHeader] = useState<ReactElement | undefined>();
  return (
    <HeaderContext.Provider value={{ setPageHeader, pageHeader }}>
      {children}
    </HeaderContext.Provider>
  );
}
