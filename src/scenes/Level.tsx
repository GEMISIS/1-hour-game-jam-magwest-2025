import React from 'react';
import { KaijuConfig, CityDefinition } from '../types';

interface Props {
  config: KaijuConfig;
  city: CityDefinition;
  onGameOver: (score: number) => void;
}

export const Level: React.FC<Props> = ({ config, city, onGameOver }) => {
  return (
    <div className="level-screen">
      <h2>Rampage in {city.name}</h2>
      <div className="sprites">
        <img src="/kaiju.svg" alt="kaiju" />
        <img src="/city.svg" alt="city" />
      </div>
      <button onClick={() => onGameOver(0)}>End</button>
    </div>
  );
};
