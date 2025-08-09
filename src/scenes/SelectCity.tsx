import React, { useState } from 'react';

interface Props {
  onBegin: (city: string) => void;
}

const cities = ['Metroville', 'Coast City'];

export const SelectCity: React.FC<Props> = ({ onBegin }) => {
  const [city, setCity] = useState(cities[0]);

  return (
    <div className="menu select-city">
      <h2>Select City</h2>
      <select value={city} onChange={(e) => setCity(e.target.value)}>
        {cities.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>
      <button onClick={() => onBegin(city)}>Begin Rampage</button>
    </div>
  );
};
