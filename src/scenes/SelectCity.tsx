import React, { useState } from 'react';
import { cities } from '../data/cities';
import { CityDefinition } from '../types';

interface Props {
  onBegin: (city: CityDefinition) => void;
}

export const SelectCity: React.FC<Props> = ({ onBegin }) => {
  const [city, setCity] = useState<CityDefinition>(cities[0]);

  return (
    <div className="menu select-city">
      <h2>Select City</h2>
      <select
        value={city.id}
        onChange={(e) =>
          setCity(
            cities.find((c) => c.id === e.target.value) as CityDefinition
          )
        }
      >
        {cities.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>
      <button onClick={() => onBegin(city)}>Begin Rampage</button>
    </div>
  );
};
