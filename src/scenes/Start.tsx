import React from 'react';

interface Props {
  onStartGame: () => void;
  onViewHighScores: () => void;
  onOptions: () => void;
}

export const Start: React.FC<Props> = ({
  onStartGame,
  onViewHighScores,
  onOptions,
}) => (
  <div className="menu start-menu">
    <p className="tagline">Unleash your monster!</p>
    <button onClick={onStartGame}>Start Game</button>
    <button onClick={onViewHighScores}>High Scores</button>
    <button onClick={onOptions}>Options</button>
  </div>
);
