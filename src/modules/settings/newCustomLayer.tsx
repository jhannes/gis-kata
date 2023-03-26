import React, { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { updateCustomLayers } from "./customLayers";

export function NewCustomLayer() {
  const [name, setName] = useState("");
  const navigate = useNavigate();

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const layer = { name, id: uuidv4(), features: {} };
    updateCustomLayers((layers) => (layers[layer.id] = layer));

    navigate(`../${layer.id}`);
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Create new custom layer</h2>
      <div>
        <div>
          <label>Name:</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoFocus
          />
        </div>
      </div>
      <div>
        <button>Save</button>
      </div>
    </form>
  );
}
