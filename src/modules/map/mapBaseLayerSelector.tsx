import React, {
  MutableRefObject,
  ReactNode,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { MapLayerDefinition } from "./baselayers";

const RadioButtonContext = React.createContext({
  selected: "",
  setSelected: (_: string) => {},
});

function BaseLayerRadioButton({ layer }: { layer: MapLayerDefinition }) {
  const { selected, setSelected } = useContext(RadioButtonContext);

  function handleChange() {
    setSelected(layer.name);
  }

  return (
    <div>
      <label>
        <input
          name="baseLayerOption"
          type="radio"
          checked={layer.name === selected}
          onChange={handleChange}
        />
        {layer.name}
      </label>
    </div>
  );
}

function BaseLayerRadioButtonList({
  baseLayers,
}: {
  baseLayers: MapLayerDefinition[];
}) {
  const [selected, setSelected] = useState(baseLayers[0].name);
  return (
    <RadioButtonContext.Provider value={{ selected, setSelected }}>
      <div>
        <h2>Select base layer</h2>
        {baseLayers.map((l) => (
          <BaseLayerRadioButton key={l.name} layer={l} />
        ))}
      </div>
    </RadioButtonContext.Provider>
  );
}

export function PopupControl({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const ref = useRef() as MutableRefObject<HTMLDivElement>;

  function handleMouseClick(e: MouseEvent) {
    if (e.target && !ref.current.contains(e.target as HTMLDivElement)) {
      setOpen(false);
    }
  }

  useEffect(() => {
    if (open) {
      window.addEventListener("mousedown", handleMouseClick);
      return () => window.removeEventListener("mousedown", handleMouseClick);
    } else {
      window.removeEventListener("mousedown", handleMouseClick);
    }
  }, [open]);
  return (
    <div
      className={`ol-control map-base-layer-selector${open ? " open" : ""}`}
      ref={ref}
    >
      <button onClick={() => setOpen((b) => !b)}>🌍</button>
      {children}
    </div>
  );
}

export function MapBaseLayerSelector({
  baseLayers,
}: {
  baseLayers: MapLayerDefinition[];
}) {
  return (
    <PopupControl>
      <BaseLayerRadioButtonList baseLayers={baseLayers} />
    </PopupControl>
  );
}