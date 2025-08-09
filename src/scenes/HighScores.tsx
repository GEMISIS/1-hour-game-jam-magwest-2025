import React from 'react';
import { ScoreRecord } from '../types';
import { cities } from '../data/cities';

interface Props {
  scores: ScoreRecord[];
  onBack: () => void;
}

export const HighScores: React.FC<Props> = ({ scores, onBack }) => (
  <div className="menu high-scores">
    <h2>High Scores</h2>
    <ol>
      {scores.map((s) => (
        <li key={s.id}>
          {s.kaiju.name} in {
            cities.find((c) => c.id === s.cityId)?.name || s.cityId
          }: ${s.score}
        </li>
      ))}
    </ol>
    <button onClick={onBack}>Back</button>
  </div>
);
