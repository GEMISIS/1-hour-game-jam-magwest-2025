import React from 'react';
import { KaijuConfig } from '../types';

interface Props {
  config: KaijuConfig;
  city: string;
  onGameOver: (score: number) => void;
}

export const Level: React.FC<Props> = ({ config, city, onGameOver }) => {
  return (
    <div className="level-screen">
      <h2>Rampage in {city}</h2>
      <div className="sprites">
        <img src="/kaiju.svg" alt="kaiju" />
        <img src="/city.svg" alt="city" />
      </div>
      <button onClick={() => onGameOver(0)}>End</button>
    </div>
  );
};
