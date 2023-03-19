import { AreaFeatureCollectionDto, AreaFeatureDto } from "./areas";
import { Link, useParams } from "react-router-dom";
import React, { useEffect } from "react";
import { MultiPolygonDto } from "../geo";
import { useMapContext } from "../map";
import { FitOptions } from "ol/View";
import { MultiPolygon, Point } from "ol/geom";

function useMapFit(geometry: MultiPolygonDto, options: FitOptions) {
  const { view } = useMapContext();
  useEffect(() => {
    const center = view.getCenter()!;
    const zoom = view.getZoom();
    console.log({ center, zoom, geometry });
    view.fit(new MultiPolygon(geometry.coordinates), options);
    return () =>
      view.fit(new Point(center), {
        maxZoom: zoom,
        duration: options.duration,
      });
  }, [geometry, options]);
}

function SelectedAreaSidebarView({ area }: { area: AreaFeatureDto }) {
  useMapFit(area.geometry, {
    padding: [50, 50, 50, 50],
    duration: 300,
  });

  return (
    <>
      <Link to={".."}>..</Link>
      <h2>{area.properties.navn}</h2>
    </>
  );
}

export function SelectedAreaSidebar(props: {
  areas: AreaFeatureCollectionDto;
}) {
  const { id } = useParams();
  const area = props.areas.features.find(
    (p) => p.properties.kommunenummer == id
  );
  if (!area) {
    return <h2>Area not found</h2>;
  }

  return <SelectedAreaSidebarView area={area} />;
}
