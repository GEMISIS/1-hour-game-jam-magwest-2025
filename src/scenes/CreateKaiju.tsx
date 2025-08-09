import React, { useState } from 'react';
import {
  KaijuConfig,
  ArmType,
  LegType,
  WeaponType,
  ARM_OPTIONS,
  LEG_OPTIONS,
  WEAPON_OPTIONS,
} from '../types';

interface Props {
  onContinue: (config: KaijuConfig) => void;
}

const KAIJU_NAMES = ['Boulderback', 'Steamjaw', 'Razorwing', 'Pyronox', 'Gigaclaw'];

const defaultConfig: KaijuConfig = {
  name: KAIJU_NAMES[Math.floor(Math.random() * KAIJU_NAMES.length)],
  arms: ArmType.Claws,
  legs: LegType.Biped,
  weapon: WeaponType.Fire,
};

export const CreateKaiju: React.FC<Props> = ({ onContinue }) => {
  const [config, setConfig] = useState<KaijuConfig>(defaultConfig);

  const handleContinue = () => {
    const name = config.name.trim();
    if (!name) return;
    onContinue({ ...config, name });
  };

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
            setConfig({ ...config, arms: e.target.value as ArmType })
          }
        >
          {ARM_OPTIONS.map(({ value, label }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label>Legs:</label>
        <select
          value={config.legs}
          onChange={(e) =>
            setConfig({ ...config, legs: e.target.value as LegType })
          }
        >
          {LEG_OPTIONS.map(({ value, label }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label>Weapon:</label>
        <select
          value={config.weapon}
          onChange={(e) =>
            setConfig({ ...config, weapon: e.target.value as WeaponType })
          }
        >
          {WEAPON_OPTIONS.map(({ value, label }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>
      <button disabled={!config.name.trim()} onClick={handleContinue}>
        Continue
      </button>
    </div>
  );
};
