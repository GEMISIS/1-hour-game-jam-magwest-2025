import React, { useState } from 'react';
import {
  KaijuConfig,
  ScoreRecord,
  GameSettings,
  CityDefinition,
  Difficulty,
} from './types';
import {
  Start,
  CreateKaiju,
  SelectCity,
  Level,
  Score,
  HighScores,
  Options,
} from './scenes';
import './App.css';

type Scene =
  | { name: 'start' }
  | { name: 'create' }
  | { name: 'options' }
  | { name: 'select'; config: KaijuConfig }
  | { name: 'level'; config: KaijuConfig; city: CityDefinition }
  | { name: 'score'; score: number }
  | { name: 'highscores' };

function App() {
  const [scene, setScene] = useState<Scene>({ name: 'start' });
  const [scores, setScores] = useState<ScoreRecord[]>([]);
  const [settings, setSettings] = useState<GameSettings>({
    music: true,
    sfx: true,
    difficulty: Difficulty.Normal,
  });

  switch (scene.name) {
    case 'start':
      return (
        <Start
          onStartGame={() => setScene({ name: 'create' })}
          onViewHighScores={() => setScene({ name: 'highscores' })}
          onOptions={() => setScene({ name: 'options' })}
        />
      );
    case 'create':
      return (
        <CreateKaiju
          onContinue={(config) => setScene({ name: 'select', config })}
        />
      );
    case 'options':
      return (
        <Options
          settings={settings}
          onClose={(s) => {
            setSettings(s);
            setScene({ name: 'start' });
          }}
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
              cityId: scene.city.id,
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
