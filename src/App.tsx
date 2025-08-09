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
import logo from './logo.svg';

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

  let currentScene: React.ReactNode = null;
  switch (scene.name) {
    case 'start':
      currentScene = (
        <Start
          onStartGame={() => setScene({ name: 'create' })}
          onViewHighScores={() => setScene({ name: 'highscores' })}
          onOptions={() => setScene({ name: 'options' })}
        />
      );
      break;
    case 'create':
      currentScene = (
        <CreateKaiju
          onContinue={(config) => setScene({ name: 'select', config })}
        />
      );
      break;
    case 'options':
      currentScene = (
        <Options
          settings={settings}
          onClose={(s) => {
            setSettings(s);
            setScene({ name: 'start' });
          }}
        />
      );
      break;
    case 'select':
      currentScene = (
        <SelectCity
          onBegin={(city) =>
            setScene({ name: 'level', config: scene.config, city })
          }
        />
      );
      break;
    case 'level':
      currentScene = (
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
      break;
    case 'score':
      currentScene = (
        <Score
          score={scene.score}
          onPlayAgain={() => setScene({ name: 'start' })}
          onViewHighScores={() => setScene({ name: 'highscores' })}
        />
      );
      break;
    case 'highscores':
      currentScene = (
        <HighScores scores={scores} onBack={() => setScene({ name: 'start' })} />
      );
      break;
  }

  return (
    <div className="App">
      <header className="app-header">
        <img src={logo} className="logo" alt="Kaiju Creator logo" />
      </header>
      {currentScene}
    </div>
  );
}

export default App;
