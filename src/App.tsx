import React, { useState } from 'react';
import {
  KaijuConfig,
  ScoreRecord,
} from './types';
import { Start } from './scenes/Start';
import { CreateKaiju } from './scenes/CreateKaiju';
import { SelectCity } from './scenes/SelectCity';
import { Level } from './scenes/Level';
import { Score } from './scenes/Score';
import { HighScores } from './scenes/HighScores';
import './App.css';

type Scene =
  | { name: 'start' }
  | { name: 'create' }
  | { name: 'select'; config: KaijuConfig }
  | { name: 'level'; config: KaijuConfig; city: string }
  | { name: 'score'; score: number }
  | { name: 'highscores' };

function App() {
  const [scene, setScene] = useState<Scene>({ name: 'start' });
  const [scores, setScores] = useState<ScoreRecord[]>([]);

  switch (scene.name) {
    case 'start':
      return (
        <Start
          onStartGame={() => setScene({ name: 'create' })}
          onViewHighScores={() => setScene({ name: 'highscores' })}
        />
      );
    case 'create':
      return (
        <CreateKaiju
          onContinue={(config) => setScene({ name: 'select', config })}
        />
      );
    case 'select':
      return (
        <SelectCity
          onBegin={(city) =>
            setScene({ name: 'level', config: scene.config, city })
          }
        />
      );
    case 'level':
      return (
        <Level
          config={scene.config}
          city={scene.city}
          onGameOver={(score) => {
            const record: ScoreRecord = {
              id: Date.now().toString(),
              kaiju: scene.config,
              city: scene.city,
              score,
              createdAt: new Date().toISOString(),
            };
            setScores((prev) => [...prev, record]);
            setScene({ name: 'score', score });
          }}
        />
      );
    case 'score':
      return (
        <Score
          score={scene.score}
          onPlayAgain={() => setScene({ name: 'start' })}
          onViewHighScores={() => setScene({ name: 'highscores' })}
        />
      );
    case 'highscores':
      return <HighScores scores={scores} onBack={() => setScene({ name: 'start' })} />;
    default:
      return null;
  }
}

export default App;
