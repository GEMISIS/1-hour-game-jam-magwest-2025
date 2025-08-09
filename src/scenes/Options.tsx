import React, { useState } from 'react';
import {
  GameSettings,
  Difficulty,
  DIFFICULTY_OPTIONS,
} from '../types';

interface Props {
  settings: GameSettings;
  onClose: (settings: GameSettings) => void;
}

export const Options: React.FC<Props> = ({ settings, onClose }) => {
  const [local, setLocal] = useState<GameSettings>(settings);

  return (
    <div className="menu options-menu">
      <h2>Options</h2>
      <div>
        <label>
          <input
            type="checkbox"
            checked={local.music}
            onChange={(e) => setLocal({ ...local, music: e.target.checked })}
          />
          Music
        </label>
      </div>
      <div>
        <label>
          <input
            type="checkbox"
            checked={local.sfx}
            onChange={(e) => setLocal({ ...local, sfx: e.target.checked })}
          />
          Sound Effects
        </label>
      </div>
      <div>
        <label>Difficulty:</label>
        <select
          value={local.difficulty}
          onChange={(e) =>
            setLocal({ ...local, difficulty: e.target.value as Difficulty })
          }
        >
          {DIFFICULTY_OPTIONS.map((d) => (
            <option key={d} value={d}>
              {d.charAt(0).toUpperCase() + d.slice(1)}
            </option>
          ))}
        </select>
      </div>
      <button onClick={() => onClose(local)}>Back</button>
    </div>
  );
};
