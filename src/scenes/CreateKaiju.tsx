import React, { useState } from 'react';
import { KaijuConfig } from '../types';

interface Props {
  onContinue: (config: KaijuConfig) => void;
}

const defaultConfig: KaijuConfig = {
  name: '',
  arms: 'claws',
  legs: 'biped',
  weapon: 'fire',
};

export const CreateKaiju: React.FC<Props> = ({ onContinue }) => {
  const [config, setConfig] = useState<KaijuConfig>(defaultConfig);

  return (
    <div className="menu create-kaiju">
      <h2>Create Kaiju</h2>
      <input
        placeholder="Name"
        value={config.name}
        onChange={(e) => setConfig({ ...config, name: e.target.value })}
      />
      <div>
        <label>Arms:</label>
        <select
          value={config.arms}
          onChange={(e) =>
            setConfig({ ...config, arms: e.target.value as KaijuConfig['arms'] })
          }
        >
          <option value="claws">Claws</option>
          <option value="club">Club</option>
          <option value="tentacles">Tentacles</option>
        </select>
      </div>
      <div>
        <label>Legs:</label>
        <select
          value={config.legs}
          onChange={(e) =>
            setConfig({ ...config, legs: e.target.value as KaijuConfig['legs'] })
          }
        >
          <option value="biped">Biped</option>
          <option value="quad">Quad</option>
          <option value="treads">Treads</option>
        </select>
      </div>
      <div>
        <label>Weapon:</label>
        <select
          value={config.weapon}
          onChange={(e) =>
            setConfig({
              ...config,
              weapon: e.target.value as KaijuConfig['weapon'],
            })
          }
        >
          <option value="fire">Fire Breath</option>
          <option value="laser">Laser Eyes</option>
          <option value="poison">Poison Darts</option>
        </select>
      </div>
      <button onClick={() => onContinue(config)}>Continue</button>
    </div>
  );
};
